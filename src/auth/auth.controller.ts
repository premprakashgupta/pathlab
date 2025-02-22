import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, Res, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './auth.guard';
import { Response, Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    email: string;
    sub: number;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    console.log("register call")
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Res({ passthrough: true }) response: Response, @Body() loginDto: LoginDto) {
    console.log("login call");

    // Call the AuthService to authenticate and retrieve the token and user
    const { access_token, user } = await this.authService.login(loginDto);

    // Set the access token as an HTTP-only cookie
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });

    // Send the user object (without the token, as it's in the cookie)
    return { data:user,message:"Login successfully" };
  }


  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest) {
    const { email, sub } = req.user;
    console.log("sub",sub)
    // implement logic for multi device login here 
    return await this.authService.getMe(sub);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
