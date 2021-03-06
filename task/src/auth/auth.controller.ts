
import {
    BadRequestException,
    Body, ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Post, Put,
    Req,
    Res, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AuthService} from "./auth.service";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './model/register.dto';
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from 'express';

import { AuthGuard } from './guards/auth.guard';


// hides password from response:
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
    ) {
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {

        // match the password confirmation:
        if (body.password !== body.password_confirm) {
            throw new BadRequestException('Passwords do not match!');
        }

        // hash the password:
        const hashed_password = await bcrypt.hash(body.password, 12);
        

        return this.userService.create({
            // first_name: body.first_name,
            // last_name: body.last_name,
            email: body.email,
            password: hashed_password,
        });
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') pass: string, 

    ) {
        const user = await this.userService.findOne({email});

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!await bcrypt.compare(pass, user.password)) {
            throw new BadRequestException('Wrong password');
        }

        // create token and send it in response:
        const jwt = await this.jwtService.signAsync({id: user.id});

        // send token in response:
        return {access_token: jwt};

    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        const id = await this.authService.userId(request);


        return this.userService.findOne({id});
    }

}