import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDetails, Role } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwtService: JwtService){}

  async register(registerDto: RegisterDto) {
    try {
      // Check if the user already exists
      const users = await this.prisma.$queryRaw<LoginDetails[]>`
        SELECT * FROM logindetails WHERE email = ${registerDto.email} LIMIT 1
      `;
      const user = users[0];
  
      if (user) {
        throw new ConflictException('User already exists, try another credentials');
      }
  
      // Hash the password before saving it
      const hashedPassword = await argon2.hash(registerDto.password);
  
      // Fetch the role
      const roles = await this.prisma.$queryRaw<Role[]>`
        SELECT * FROM role WHERE code = ${registerDto.role} LIMIT 1
      `;
      const role = roles[0];
  
      if (!role) {
        throw new BadRequestException('Invalid role');
      }
  
      // Create the new user using a parameterized query
      await this.prisma.$executeRaw`
        INSERT INTO logindetails (email, password, roleId) VALUES (${registerDto.email}, ${hashedPassword}, ${role.id})
      `;
  
      // Retrieve the newly created user
      const newUsers = await this.prisma.$queryRaw<LoginDetails[]>`
        SELECT * FROM logindetails WHERE email = ${registerDto.email} LIMIT 1
      `;
      const newUser = newUsers[0];
  
      if (!newUser) {
        throw new InternalServerErrorException('User registration failed unexpectedly');
      }
  
      // Exclude the password field from the response
      const { password, ...passwordExcludedUser } = newUser;
      return passwordExcludedUser;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while registering the user');
    }
  }
  
  

  async login(loginDto: LoginDto) {
    try {
      // const user=await this.prisma.loginDetails.findUnique({where:{email:loginDto.email}});
      const [user] = await this.prisma.$queryRaw<LoginDetails[]>`
        SELECT * FROM logindetails WHERE email = ${loginDto.email} LIMIT 1
      `;
      
      if(!user){
        throw new BadRequestException("Invalid Credential email, Try again !");
      }
      const passwordMatched=await argon2.verify(user.password,loginDto.password);
      if(!passwordMatched){
        throw new UnauthorizedException("Invalid Credential, Try again !");
      }
      const payload = { sub: user.id, username: user.email };
      const {password,...passwordExcludedUser}=user
      return {
        user:passwordExcludedUser,
        access_token: await this.jwtService.signAsync(payload),
      };

    } catch (error) {
      // Handle errors and provide more specific error messages
      if (error instanceof ConflictException) {
        throw error; // Re-throw ConflictException to ensure proper HTTP status code
      }
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        // Propagate specific errors with their own messages and status codes
        throw error;
      }
      // Log the error for debugging purposes
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while login the user');
    }
  
  }


async getMe(id: number) {
  try {
    // Secure raw query using Prisma's parameterized query to prevent SQL injection
    const users = await this.prisma.$queryRaw<LoginDetails[]>`
      SELECT logindetails.*, role.name as roleName, role.code as roleCode 
      FROM logindetails 
      JOIN role ON role.id = logindetails.roleId 
      WHERE logindetails.id = ${id} 
      LIMIT 1;
    `;

    if (users.length === 0) {
      throw new BadRequestException("User not found, try again!");
    }

    const user = users[0];

    // Remove password field before returning
    const { password, ...passwordExcludedUser } = user;
    return passwordExcludedUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new InternalServerErrorException("Something went wrong while fetching the user.");
  }
}

  

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
