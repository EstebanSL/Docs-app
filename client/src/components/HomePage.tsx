import React, { useEffect, useState } from "react";
import {
  FileIcon,
  PlusIcon,
  EditIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Document {
  _id: string;
  content: Object;
  title: string;
  lastEdited: string;
}

export default function Component() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);

  const getDocumentsList = async () => {
    // Fetch documents from server
    const response = await fetch("http://localhost:3000/documents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setDocuments(data);
  };

  useEffect(() => {
    getDocumentsList();
  }, []);

  const updateTitle = async (document: Document, newtitle: string) => {
    console.log(JSON.stringify({
      ...document,
      title: newtitle,
    }));
    
    const response = await fetch(
      `http://localhost:3000/documents/${document._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...document,
          title: newtitle,
        }),
      }
    );
    console.log(response);
  };

  useEffect(() => {
    getDocumentsList();
  }, []);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  const handleEditStart = (id: number, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleEditSave = async (id: string) => {
    console.log(id);

    const document = documents.find((d) => d._id === id);

    try {
      if (document) {
        await updateTitle(document, editingTitle);
      }
      setDocuments(
        documents.map((doc) =>
          doc._id === id ? { ...doc, title: editingTitle } : doc
        )
      );
      setEditingId(null);
      setEditingTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <Button
            className="flex items-center"
            onClick={() => navigate(`/documents/${uuidv4()}`)}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Input
            className="max-w-md"
            type="search"
            placeholder="Search documents"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: any) => (
            <Card
              key={doc._id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <FileIcon className="h-8 w-8 text-blue-500" />
                {editingId === doc._id ? (
                  <Input
                    value={editingTitle}
                    onChange={handleTitleChange}
                    className="flex-grow"
                    autoFocus
                  />
                ) : (
                  <CardTitle className="flex-grow">{doc.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Last edited {doc.last_updated}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/documents/${doc._id}`)}
                >
                  Open
                </Button>
                {editingId === doc._id ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditSave(doc._id)}
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditCancel}
                    >
                      <XIcon className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditStart(doc._id, doc.title)}
                  >
                    <EditIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
