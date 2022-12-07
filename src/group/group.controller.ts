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

import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Group')
@Controller('Group')
@UseGuards(RolesGuard)
export class GroupController {
    constructor(
        private readonly GroupService: GroupService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Get All Group',})
    @ApiOkResponse({})
    async getAllGroup() {
        return await this.GroupService.getAllGroups();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Get One Group',})
    @ApiParam({name: 'id', description: 'id of Group'})
    @ApiOkResponse({})
    async getOneGroups(@Param() params) {
        return await this.GroupService.getOneGroup(params.id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({summary: 'Create one Group',})
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiCreatedResponse({})
    
    async createGroup(@Body() createGroupDto: CreateGroupDto) {

        
        return await this.GroupService.createGroup(createGroupDto);
    }


    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({summary: 'Update one Group by id ( all params )',})
    @ApiBearerAuth()
    @ApiParam({name: 'id', description: 'id of Group'})
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async updateWithAllParams(@Param() params, @Body() createGroupDto: CreateGroupDto) {
        return await this.GroupService.updateGroupPut(params.id, createGroupDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({summary: 'Delete one Group',})
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiParam({name: 'id', description: 'id of Group we want to delete.'})
    @ApiOkResponse({})
    async deleteOneGroup(@Param() params) {
        return await this.GroupService.deleteGroup(params.id);
    }

    

}
