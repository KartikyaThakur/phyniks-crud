import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { <%= classify(singular(name)) %>Document } from './<%= singular(name) %>.schema';
import { CrudService } from 'src/base/crud.service';
  
@Injectable()
export class <%= classify(name) %>Service extends CrudService {
 constructor(
    @InjectModel('<%= classify(singular(name)) %>')
      private readonly <%= lowercased(singular(name)) %>Model: Model<<%= classify(singular(name)) %>Document>,
    ) {
      super(<%= lowercased(singular(name)) %>Model);
    }
}