// features/lists/lists.service.ts
import Documents from "./document.schema";

async function getAll() {
  return Documents.find();
}

async function get(id: string) {
  return Documents.findOne({ _id: id });
}

async function create(data) {
  return new Documents(data).save();
}

async function update(id: string, data: any) {  
  return Documents.findOneAndUpdate({ _id: id }, data);
}

async function remove(id: any) {
  return Documents.findByIdAndDelete(id);
}

export { getAll, get, create, update, remove };