import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type <%= classify(singular(name)) %>Document = <%= classify(singular(name)) %> & Document;


@Schema({timestamps: true})
export class <%= classify(singular(name)) %> {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ ref: 'User' })
  createdBy: mongoose.Types.ObjectId;;
}

export const <%= classify(singular(name)) %>Schema = SchemaFactory.createForClass(<%= classify(singular(name)) %>);