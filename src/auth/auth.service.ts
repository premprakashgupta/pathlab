import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwtService: JwtService){}

  async register(registerDto: RegisterDto) {
    try {
      // Check if the user already exists
      const user = await this.prisma.loginDetail.findUnique({
        where: { email: registerDto.email },
      });
      if (user) {
        throw new ConflictException('User already exists, try another credentials');
      }

      // Hash the password before saving it
      const hashedPassword = await argon2.hash(registerDto.password);

      // Create the new user in the database
      const newUser = await this.prisma.loginDetail.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
        },
      });

      // Exclude the password field from the response
      const { password, ...passwordExcludedUser } = newUser;

      return passwordExcludedUser;
    } catch (error) {
      // Handle errors and provide more specific error messages
      if (error instanceof ConflictException) {
        throw error; // Re-throw ConflictException to ensure proper HTTP status code
      }
      // Log the error for debugging purposes
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while registering the user');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user=await this.prisma.loginDetail.findUnique({where:{email:loginDto.email}});
      
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
      const user = await this.prisma.loginDetail.findUnique({ where: { id } });
      if (!user) {
        throw new BadRequestException("User not found, Try again !");
      }
      
      const { password, ...passwordExcludedUser } = user;
      return passwordExcludedUser;
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
