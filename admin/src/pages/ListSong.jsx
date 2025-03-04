import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../components/URL";
import Loading from "../components/Loading";

const ListSong = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/songs/list`);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setData(res?.data?.songs);
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
  const removeSong = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/songs/remove`, { id });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        await fetchSongs();
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
    fetchSongs();
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
            >
              <img className="w-12" src={item.image} alt="Song Image" />
              <p>{item.name}</p>
              <p>{item.album}</p>
              <p>{item.duration}</p>
              <p
                className="cursor-pointer"
                onClick={() => removeSong(item._id)}
              >
                x
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListSong;
