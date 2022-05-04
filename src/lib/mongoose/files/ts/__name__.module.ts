import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionName } from 'src/utils/connectionName';
import { <%= classify(singular(name)) %>Schema } from './<%= singular(name) %>.schema';
import { <%= classify(name) %>Controller } from './<%= name %>.controller';
import { <%= classify(name) %>Service } from './<%= name %>.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: '<%= classify(singular(name)) %>',
        schema: <%= classify(singular(name)) %>Schema,
      },
    ], ConnectionName.ADMIN),
  ],
  controllers: [<%= classify(name) %>Controller],
  providers: [<%= classify(name) %>Service],
  exports: [<%= classify(name) %>Service],
})
export class <%= classify(name) %>Module {}
