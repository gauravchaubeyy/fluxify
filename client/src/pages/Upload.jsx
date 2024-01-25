import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    file: null, // Video file
    thumbnail: null, // Thumbnail file
  });

  function handleChange(event) {
    const inputValue =
      event.target.name === "file" || event.target.name === "thumbnail"
        ? event.target.files && event.target.files.length > 0
          ? event.target.files[0]
          : null
        : event.target.value;

    setForm({
      ...form,
      [event.target.name]: inputValue,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const videoData = new FormData();

    videoData.append("videoFile", form.file);
    videoData.append("thumbnail", form.thumbnail); // Append thumbnail file
    videoData.append("title", form.title);
    videoData.append("description", form.description);

    axios
      .post("http://localhost:3000/upload", videoData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="container max-w-md mx-auto mt-8 p-20 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-xl font-bold mb-4 px-16 text-red-700">
        upload to fluxify
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-2 ">
          <input
            onChange={handleChange}
            className="border p-2 w-fit bg-slate-100"
            type="text"
            name="title"
            autoComplete="off"
            placeholder="Title"
          />
        </div>
        <div className="mb-2">
          <textarea
            onChange={handleChange}
            className="border p-2 w-fit bg-slate-100"
            type="text"
            name="description"
            autoComplete="off"
            placeholder="Description"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="file" className="font-bold text-red-700">
            MP4:
          </label>
          <input
            onChange={handleChange}
            accept="video/mp4"
            type="file"
            name="file"
            id="file"
            placeholder="Add Video File"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="thumbnail" className="font-bold text-red-700">
            Thumbnail:
          </label>
          <input
            onChange={handleChange}
            accept="image/*" // Accept any image type for the thumbnail
            type="file"
            name="thumbnail"
            id="thumbnail"
            placeholder="Add Thumbnail"
          />
        </div>
        <div className="px-24">
          {" "}
          <button
            type="submit"
            className="w-20 h-8 aspect-square-full border-gray-950 flex items-center justify-center border text-black hover:bg-black hover:text-red-700 font-bold"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
