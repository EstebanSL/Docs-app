import "quill/dist/quill.snow.css";
import Quill from "quill";
import { FC, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Delta } from "quill/core";
import { useParams } from "react-router";
import { Button } from "./ui/button";
import { SaveIcon } from "lucide-react";
import { Input } from "./ui/input";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["link", "image", "video", "blockquote", "code-block"],
  ["clean"],
];

const SET_INTERVAL_MS = 2000;

export const TextEditor: FC = () => {
  const [title, setTitle] = useState("Untitled Document");
  console.log(title);

  const [socket, setSocket] = useState<Socket<any, any> | null>(null);
  const [quill, setQuill] = useState<any>(null);

  const { documentId } = useParams();

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper === null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        clipboard: {
          matchVisual: false,
        },
      },
    });
    q.disable();
    q.setText("Loading document...");
    setQuill(q);
  }, []);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handler = (delta: Delta, _: any, source: string) => {
      if (source !== "user") return;
      console.log(delta);

      socket?.emit("editor-change", { content: delta, title: title });
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handler = (data: { content: Delta; title: string }) => {
      quill.updateContents(data.content);
      setTitle(data.title);
    };
    socket.on("receive-editor-change", handler);

    return () => {
      socket.off("receive-editor-change", handler);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;
    socket.emit("get-document", documentId);

    socket.once("load-document", (document: any) => {
      quill.setContents(document.content);
      setTitle(document.title);
      quill.enable();

      // Set the interval to save the document only after it has been loaded
      const interval = setInterval(() => {
        save();
      }, SET_INTERVAL_MS);

      // Clear the interval on component unmount
      return () => {
        clearInterval(interval);
      };
    });
  }, [socket, quill, documentId]);

  const save = () => {
    console.log('save');
    
    socket?.emit("save-document", {
      content: quill.getContents(),
      title: title,
      last_updated: new Date()
    });
  };

  return (
    <>
      <header className="bg-gray-100 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">
            {title}
          </h1>
        </div>
      </header>
      <div className="container" ref={wrapperRef}></div>
    </>
  );
};
