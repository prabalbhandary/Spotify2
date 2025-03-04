import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../components/URL";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAlbum = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/albums/list`);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setData(res?.data?.albums);
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
  const removeAlbum = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/albums/remove`, { id });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        await fetchAlbum();
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
    fetchAlbum();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <p>All Album List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Color</b>
          <b>Action</b>
        </div>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
            >
              <img className="w-12" src={item.image} alt="Album Image" />
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <input type="color" value={item.bgColour} />
              <p
                className="cursor-pointer"
                onClick={() => removeAlbum(item._id)}
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

export default ListAlbum;
