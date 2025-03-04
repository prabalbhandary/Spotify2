import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../components/Loading";
import { BASE_URL } from "../components/URL";

const AddSong = () => {
  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);
      const res = await axios.post(`${BASE_URL}/songs/add`, formData);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(false);
        setSong(false);
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
  const loadAlbumData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/albums/list`);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setAlbumData(res?.data?.albums);
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
  useEffect(() => {
    loadAlbumData();
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p>Upload Song</p>
          <input
            onChange={(e) => setSong(e.target.files[0])}
            type="file"
            accept="audio/*"
            id="song"
            hidden
          />
          <label htmlFor="song">
            <img
              className="w-24 cursor-pointer"
              src={song ? assets.upload_added : assets.upload_song}
              alt="Upload Song"
            />
          </label>
        </div>
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
              alt="Upload Image"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Song Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Enter Song Name"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Song Description</p>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Enter Song Description"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          defaultValue={album}
          onChange={(e) => setAlbum(e.target.value)}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]"
        >
          <option value="none">None</option>
          {
            albumData.map((item, index) => (
                <option key={index} value={item.name}>{item.name}</option>
            ))
          }
        </select>
      </div>
      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
};

export default AddSong;
