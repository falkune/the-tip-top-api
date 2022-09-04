import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiBearerAuth,
    ApiHeader,
    ApiOperation,
    ApiParam, 
    ApiHeaders
    
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Session')
@Controller('Session')
@UseGuards(RolesGuard)
export class SessionController {
    constructor(
        private readonly SessionService: SessionService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Get All Session',})
    @ApiOkResponse({})
    async getAllSession() {
        return await this.SessionService.getAllSessions();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Get One Session',})
    @ApiParam({name: 'id', description: 'id of Session'})
    @ApiOkResponse({})
    async getOneSessions(@Param() params) {
        return await this.SessionService.getOneSession(params.id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({summary: 'Create one Session',})
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiCreatedResponse({})
    
    async createSession(@Body() createSessionDto: CreateSessionDto) {

        console.log(ApiHeaders.name,"Hello chiekh depuis");
        return await this.SessionService.createSession(createSessionDto);
    }


    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({summary: 'Update one Session by id ( all params )',})
    @ApiBearerAuth()
    @ApiParam({name: 'id', description: 'id of Session'})
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async updateWithAllParams(@Param() params, @Body() createSessionDto: CreateSessionDto) {
        return await this.SessionService.updateSessionPut(params.id, createSessionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({summary: 'Delete one Session',})
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiParam({name: 'id', description: 'id of Session we want to delete.'})
    @ApiOkResponse({})
    async deleteOneSession(@Param() params) {
        return await this.SessionService.deleteSession(params.id);
    }
}