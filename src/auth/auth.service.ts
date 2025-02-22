import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    try {
      // Check if the user already exists
      const existingUser = await this.prisma.loginDetails.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User already exists, try another credentials');
      }

      // Hash the password before saving it
      const hashedPassword = await argon2.hash(registerDto.password);

      // Fetch the role
      const role = await this.prisma.role.findUnique({
        where: { id: registerDto.roleId },
      });

      if (!role) {
        throw new BadRequestException('Invalid role');
      }

      // Create the new user
      const newUser = await this.prisma.loginDetails.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          roleId: role.id,
        },
      });

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
      const user = await this.prisma.loginDetails.findUnique({
        where: { email: loginDto.email },
        include: {
          role: {
            select:{
              
              code:true
            }
          },

        },
      });

      if (!user) {
        throw new BadRequestException('Invalid Credential email, Try again!');
      }

      const passwordMatched = await argon2.verify(user.password, loginDto.password);
      if (!passwordMatched) {
        throw new UnauthorizedException('Invalid Credential, Try again!');
      }

      const payload = { sub: user.id, username: user.email };
      const { password, ...passwordExcludedUser } = user;
      // generating new token
      const access_token=await this.jwtService.signAsync(payload);
      await this.prisma.token.create({
        data: {
          loginId: user.id,
          token: access_token,  
      }})

      return {
        user: passwordExcludedUser,
        access_token
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while logging in the user');
    }
  }

  async getMe(id: number) {
    try {
      const user = await this.prisma.loginDetails.findUnique({
        where: { id },
        include: {
          role: true,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found, try again!');
      }

      // Remove password field before returning
      const { password, ...passwordExcludedUser } = user;
      return passwordExcludedUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Something went wrong while fetching the user.');
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
