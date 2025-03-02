import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_PLAYLIST } from "../../utils/constants";
import useResponseHandler from "../../hooks/UseResponseHandler";
import { FiChevronDown } from "react-icons/fi";
import { IoMdGlobe } from "react-icons/io";
import { Check, LockKeyhole, Plus, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import debounce from "lodash.debounce";

const visibilityOptions = [
  {
    name: "Public",
    msg: "Anyone can search for and view",
    icon: <IoMdGlobe className="text-[1.6rem]" />,
    icon2: <Check />,
  },
  {
    name: "Private",
    msg: "Only u can view",
    icon: <LockKeyhole size={22} />,
    icon2: <Check />,
  },
];

export const CreatePlaylist = ({ setShowCreatePlaylist }) => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const { handleResponse, handleError } = useResponseHandler();
  const [playlistData, setPlaylistData] = useState({
    title: "",
    status: "Private",
  });
  const [disable, setDisable] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData({ ...playlistData, [name]: value });
    setDisable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowCreatePlaylist(false);
    const { title, status } = playlistData;
    if (!title) {
      toast.error("Title can't be empty");
      setDisable(true);
      return;
    }
    const details = {
      title,
      status,
      videoId,
    };

    try {
      const response = await axios.post(
        BACKEND_PLAYLIST + "/createPlaylist",
        details,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("New playlist created successfully");
      } else if (response.status === 201) {
        toast.success("playlist already exist");
      }
    } catch (error) {
      console.error("Error while creating playlist", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionSelect = (option) => {
    setPlaylistData({ ...playlistData, status: option });
    setIsDropdownOpen(true);
  };

  return (
    <div
      onClick={() => setShowCreatePlaylist(false)}
      className="absolute w-dvw h-dvh top-0 left-0 remove-scrollbar bg-black bg-opacity-30 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-icon_black rounded-md p-5 flex flex-col gap-5 justify-between"
      >
        <h1>New playlist</h1>
        <input
          className="py-3 px-2 border border-Lightblack  placeholder-Lightblack outline-none dark:bg-icon_black rounded-md"
          type="text"
          name="title"
          onChange={handleChange}
          placeholder="Choose a title"
        />
        <div
          onClick={toggleDropdown}
          className="relative flex justify-between border border-Lightblack py-1 items-center px-2  outline-none rounded-md"
        >
          <div className="flex flex-col">
            <span className="text-sm text-Lightblack">visibility</span>
            <p className="text-sm">{playlistData.status}</p>
          </div>
          <FiChevronDown />
          {isDropdownOpen && (
            <ul className="absolute z-10 w-[93%] translate-x-2 -bottom-[9.4rem] shadow-xl left-0 bg-white dark:bg-icon_black rounded-md mt-1">
              <h1 className="px-4 py-2 border-b border-Lightblack">
                Visibility
              </h1>
              {visibilityOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionSelect(option.name)}
                  className={`flex justify-between items-center px-2 py-2 text-sm font-medium hover:bg-gray-200 ${
                    playlistData.status === option.name &&
                    "dark:bg-hover_icon_black"
                  } ${
                    playlistData.status === "Private" && "rounded-b-md"
                  } dark:hover:bg-hover_icon_black cursor-pointer`}
                >
                  <div className="flex gap-2 items-center">
                    {option.icon}
                    <div>
                      <p className="text-sm">{option.name}</p>
                      <p className="text-Lightblack text-xs">{option.msg}</p>
                    </div>
                  </div>
                  {playlistData.status === option.name && option.icon2}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-5">
          <button
            onClick={() => {
              setShowCreatePlaylist(false);
            }}
            className="px-10 py-1 border rounded-full hover:bg-hover_icon_black"
          >
            Cancel
          </button>
          <button
            disabled={disable}
            onClick={handleSubmit}
            className="px-10 py-1 border rounded-full dark:bg-white dark:text-black font-medium text-sm hover:bg-gray-300"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export const SavePlaylist = ({ setShowPlaylist, setShowCreatePlaylist }) => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");

  const user = useSelector((store) => store?.user?.user);
  const [playlist, setPlaylist] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [previousSelectedItem, setPreviousSelectedItem] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          BACKEND_PLAYLIST + `/userPlaylist/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setPlaylist(response?.data?.data);
        }
      } catch (error) {
        console.error("Error while fetching user playlist", error);
      }
    };
    if (user._id) {
      fetchData();
    }
  }, [user._id]);

  const handleChange = (e, id) => {
    const isChecked = e.target.checked;
    setSelectedItem((prevItem) => {
      if (isChecked) {
        return [...prevItem, id];
      } else {
        return prevItem.filter((itemId) => itemId !== id);
      }
    });
  };

  const handleSelectAll = async (e) => {
    const isChecked = e.target.checked;

    setSelectAll(isChecked);

    if (isChecked) {
      setSelectedItem(playlist.map((item) => item._id));
    } else {
      setSelectedItem([]);
    }
  };

  const addVideoToPlaylist = async (selectedItem) => {
    const videoData = {
      selectedItem,
      videoId,
    };

    try {
      await axios.post(BACKEND_PLAYLIST + "/addVideo", videoData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error while adding video to playlist", error);
    }
  };

  const removeVideoToPlaylist = async (selectedItem) => {
    const videoData = {
      selectedItem,
      videoId,
    };

    try {
      await axios.post(BACKEND_PLAYLIST + "/removeVideo", videoData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error while adding video to playlist", error);
    }
  };

  useEffect(() => {
    if (selectedItem.length === playlist.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItem, playlist]);

  const debounceAddVideo = debounce((item) => {
    addVideoToPlaylist(item);
  }, 1500);

  const debounceRemovedVideo = debounce((item) => {
    removeVideoToPlaylist(item);
  }, 1500);

  useEffect(() => {
    const addItem = selectedItem.filter(
      (item) => !previousSelectedItem.includes(item)
    );

    if (addItem.length >= 1) {
      debounceAddVideo(addItem);
    }

    const removedItem = previousSelectedItem.filter(
      (item) => !selectedItem.includes(item)
    );

    if (removedItem.length >= 1) {
      debounceRemovedVideo(removedItem);
    }

    setPreviousSelectedItem(selectedItem);
    return () => {
      debounceAddVideo.cancel();
      debounceRemovedVideo.cancel();
    };
  }, [selectedItem]);

  return (
    <div
      onClick={() => setShowPlaylist(false)}
      className="absolute w-dvw h-dvh top-0 left-0 remove-scrollbar bg-black bg-opacity-30 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative dark:bg-icon_black rounded-md w-[18rem] p-4 font-medium flex flex-col items-center gap-3"
      >
        <div className="flex justify-between items-center w-full ">
          <h1>Save video to...</h1>
          <X
            onClick={() => setShowPlaylist(false)}
            size={24}
            className="cursor-pointer"
            strokeWidth={1.25}
          />{" "}
        </div>
        {playlist.length > 0 && (
          <div className="flex items-center gap-2 text-sm w-full">
            <div className="custom-checkbox-container">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                id="selectAll"
              />
              <label id="custom-label" for="selectAll"></label>
            </div>
            <p className="line-clamp-2 leading-4">Select All</p>
          </div>
        )}
        <div className="max-h-44 space-y-1 remove-scrollbar overflow-y-scroll w-full">
          {playlist &&
            playlist.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center w-full"
              >
                <div className="flex items-center gap-2 text-sm w-[90%]">
                  <div className="custom-checkbox-container">
                    <input
                      type="checkbox"
                      onChange={(e) => handleChange(e, item._id)}
                      checked={selectedItem.includes(item._id)}
                      id={`customCheckbox-${item._id}`}
                    />
                    <label
                      id="custom-label"
                      for={`customCheckbox-${item._id}`}
                    ></label>
                  </div>
                  <p className="line-clamp-2 leading-4">{item.title}</p>
                </div>
                {item.status === "Private" ? (
                  <LockKeyhole size={15} strokeWidth={2} />
                ) : (
                  <IoMdGlobe size={17} />
                )}
              </div>
            ))}
        </div>
        <button
          onClick={() => {
            setShowCreatePlaylist(true);
            setShowPlaylist(false);
          }}
          className="px-6 py-2 rounded-full dark:bg-hover_icon_black dark:hover:bg-[#4D4D4D]  flex gap-2 items-center"
        >
          <Plus size={20} strokeWidth={2} />
          New playlist
        </button>
      </div>
    </div>
  );
};

const PlaylistPage = {
  CreatePlaylist,
  SavePlaylist,
};

export default PlaylistPage;
