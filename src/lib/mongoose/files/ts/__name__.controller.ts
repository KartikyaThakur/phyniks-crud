import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { <%= classify(name) %>Service } from './<%= name %>.service';
import { <%= singular(classify(name)) %>Document } from './<%= singular(name) %>.schema';
import { <%= singular(classify(name)) %>CreateDto } from './dto/<%= singular(name) %>-create.dto';
import { <%= singular(classify(name)) %>UpdateDto } from './dto/<%= singular(name) %>-update.dto';

@Controller('<%= dasherize(name) %>')
@UseGuards(AuthGuard)
export class <%= classify(name) %>Controller {
    constructor(
        private readonly <%= lowercased(name) %>Service: <%= classify(name) %>Service,
        @InjectModel('<%= singular(classify(name)) %>') private readonly <%= singular(lowercased(name)) %>Model: Model<<%= singular(classify(name)) %>Document>,) {}

    @Get('test')
    testRoute() {
        return '<%= classify(name) %>: test route active';
    }

    @Get()
    async fetchAll() {
        const <%= lowercased(name) %> = await this.<%= singular(lowercased(name)) %>Model.find({})
        .populate('createdBy')
        .sort({createdAt:-1})
        .lean();
        if (!<%= lowercased(name) %>) {
          throw new NotFoundException('Not Found');
        }
        return <%= lowercased(name) %>;        
    }

    @Get(':id')
    async fetchOne(@Param('id') id: mongoose.Types.ObjectId) {
        return await this.<%= lowercased(name) %>Service.findOneById(id);
    }

    @Post()
    async addOne(
        @Body() <%= singular(lowercased(name)) %>CreateDto: <%= singular(classify(name)) %>CreateDto, 
        @AuthUser('_id') createdBy: mongoose.Types.ObjectId,) {
        const <%= singular(lowercased(name)) %>Object = {...<%= lowercased(name) %>CreateDto,createdBy }
        return this.<%= lowercased(name) %>Service.createOne(<%= singular(lowercased(name)) %>Object);
    }

    @Patch(':id')
    async updateOne(
        @Param('id') id: mongoose.Types.ObjectId,
        @Body() <%= singular(lowercased(name)) %>UpdateDto: <%= singular(classify(name)) %>UpdateDto,
    ) {
        return await this.<%= lowercased(name) %>Service.updateOneById(id, <%= lowercased(name) %>UpdateDto);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: mongoose.Types.ObjectId) {
        return await this.<%= lowercased(name) %>Service.deleteOneById(id);
    }
}