import React, { useState } from "react";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../components/URL";

const AddAlbum = () => {
  const [image, setImage] = useState(false);
  const [bgColour, setBgColour] = useState("#121212");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("bgColour", bgColour);
      const res = await axios.post(`${BASE_URL}/albums/add`, formData);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setName("");
        setDesc("");
        setBgColour("#121212");
        setImage(false);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      if (error?.response?.data || error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Internal Server Error");
      }
    }
    setLoading(false);
  };
  return loading ? (
    <Loading />
  ) : (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex flex-col gap-4">
        <p>Upload Image</p>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          accept="image/*"
          id="image"
          hidden
        />
        <label htmlFor="image">
          <img
            className="w-24 cursor-pointer"
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Upload Area"
          />
        </label>
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Enter Album Name"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album Description</p>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Enter Album Descriptoion"
          required
        />
      </div>
      <div className="flex flex-col gap-3">
        <p>Background Colour</p>
        <input
          value={bgColour}
          onChange={(e) => setBgColour(e.target.value)}
          type="color"
        />
      </div>
      <button
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
        type="submit"
      >
        ADD
      </button>
    </form>
  );
};

export default AddAlbum;
