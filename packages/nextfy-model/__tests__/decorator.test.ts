import { expect, test } from '@jest/globals';
import { DataModel, FieldInfo, FieldType, ModelMeta } from '../src/meta'
import {field} from '../src/decorator'

test("test field", () => {
    class A extends DataModel{
        @field('名字',FieldType.string)
        name:string = 'aaa'
    }

    const f = ModelMeta.get(A).fields.get('name') as FieldInfo
    
    expect(f).toBeInstanceOf(FieldInfo)
    expect(f.key).toBe('name');
    expect(f.label).toBe('名字');
    expect(f.type).toBe(FieldType.string);
});
