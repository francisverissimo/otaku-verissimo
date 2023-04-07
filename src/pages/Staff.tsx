import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_STAFF } from "../lib/queries";
import { CircularLoading } from "../components/Loading";
import { SimpleHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { MyDivider } from "../components/MyComponents";
import { Grow } from "@mui/material";
import { StaffModel } from "../types";
import { Heart } from "phosphor-react";

export function Staff() {
  const { id } = useParams() as { id: string };

  const { data, error } = useQuery(GET_STAFF, {
    variables: { id: id },
    notifyOnNetworkStatusChange: true,
  });

  const staff: StaffModel = data && data.Staff;

  if (error) console.error(error);

  if (staff) {
    const title = `${staff.name.full} · otakuVERISSIMO`;

    document.title = title;
  }

  useEffect(() => {
    scrollTo({ top: 0 });
  }, []);

  if (error)
    return (
      <div className="flex flex-col p-4 m-auto bg-zinc-50 shadow-xl">
        <strong>{error.name}</strong>
        <span>{error.message}</span>
      </div>
    );

  if (!staff && !error) return <CircularLoading />;

  return (
    <div className="flex flex-col justify-between min-h-screen pt-10 bg-zinc-100">
      <SimpleHeader />

      {staff && (
        <div className="flex flex-col gap-2 mb-auto py-4 max-w-6xl mx-auto w-full">
          <div className="flex flex-col items-center">
            <strong className="text-2xl">{staff.name.full}</strong>
            <span>{staff.name.native}</span>
          </div>

          <div className="place-self-center">
            <img
              src={staff.image.large}
              alt={staff.name.full}
              loading="lazy"
              style={{
                opacity: 0,
                transform: "scale(0.84)",
                transitionDuration: "700ms",
              }}
              onLoad={(t) => {
                t.currentTarget.style.opacity = "1";
                t.currentTarget.style.transform = "initial";
              }}
              className="w-52 rounded shadow-lg"
            />
          </div>

          {staff.favourites > 0 && (
            <div className="flex gap-1 items-center place-self-center min-h-[22px]">
              <Heart size={22} weight="fill" className="text-red-600" />
              <span className="text-zinc-600 text-sm font-medium">
                {staff.favourites}
              </span>
            </div>
          )}

          {/* <MyDivider /> */}
          {/* 
          <Tabs.List className="flex justify-center mt-auto w-full px-2 gap-3 md:gap-8 max-w-6xl bg-zinc-700 duration-200 text-zinc-100 text-md font-medium mx-auto rounded">
            <Tabs.Trigger
              className="uppercase py-2 text-[14px] md:text-[16px] hover:text-zinc-400 data-[state=active]:text-orange-500 border-b-2 border-transparent data-[state=active]:border-main duration-200"
              value="bio"
            >
              bio
            </Tabs.Trigger>

            <Tabs.Trigger
              className="uppercase py-2 text-[14px] md:text-[16px] hover:text-zinc-400 data-[state=active]:text-orange-500 border-b-2 border-transparent data-[state=active]:border-main duration-200"
              value="voice"
            >
              voice works
            </Tabs.Trigger>
            <Tabs.Trigger
              className="uppercase py-2 text-[14px] md:text-[16px] hover:text-zinc-400 data-[state=active]:text-orange-500 border-b-2 border-transparent data-[state=active]:border-main duration-200"
              value="anime"
            >
              anime staff roles
            </Tabs.Trigger>
          </Tabs.List> */}

          {/* <div className="grid">
            <span>Birth: </span>
            <span>Age: </span>
            <span>Gender: </span>
            <span>Years active: </span>
            <span>Hometown: </span>
          </div> */}

          <Grow in timeout={600}>
            <div>
              <div className="flex flex-col gap-4 pb-8">
                {staff.characters.edges.map((edge, index, array) => (
                  <div
                    key={edge.id}
                    className="grid px-4 flex-col gap-4 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-t from-zinc-600 via-zinc-400 to-zinc-300 rounded-full">
                        <Link
                          to={`/character/${edge.node.id}`}
                          title={edge.node.name.full}
                        >
                          <img
                            src={edge.node.image.large}
                            alt={edge.node.name.full}
                            className="object-cover w-24 h-24 md:w-32 md:h-32 shadow-black/20 shadow-lg rounded-full"
                            loading="lazy"
                            style={{
                              opacity: 0,
                              transitionDuration: "700ms",
                            }}
                            onLoad={(t) => {
                              t.currentTarget.style.opacity = "1";
                            }}
                          />
                        </Link>
                      </div>

                      <div className="flex flex-col flex-1">
                        <Link
                          to={`/character/${edge.node.id}`}
                          title={edge.node.name.full}
                        >
                          <span className="font-medium text-lg break-all">
                            {edge.node.name.full}
                          </span>
                        </Link>
                        <span className="text-sm text-main">{edge.role}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] lg:grid-cols-[repeat(auto-fill,160px)] gap-y-4 gap-x-4 justify-between">
                      {edge.media.map((media) => (
                        <Link
                          key={media.id}
                          to={`/anime/${media.id}`}
                          title={media.title.romaji}
                        >
                          <div className="rounded">
                            <div className="bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500 rounded">
                              <img
                                src={media.coverImage.large}
                                alt={media.title.romaji}
                                loading="lazy"
                                style={{
                                  opacity: 0,
                                  aspectRatio: "6/9",
                                  objectFit: "cover",
                                  width: "100%",
                                  transitionDuration: "700ms",
                                }}
                                onLoad={(t) => {
                                  t.currentTarget.style.opacity = "1";
                                }}
                                className="shadow-black/20 shadow-lg rounded"
                              />
                            </div>

                            <div className="top-0 left-0 right-0 flex items-center pt-2">
                              <span className="text-sm text-main">
                                {media.format
                                  ? media.format.replaceAll("_", " ")
                                  : ""}
                              </span>
                            </div>

                            <div className="bottom-0 left-0 right-0 flex items-center">
                              <span className="text-sm font-medium line-clamp-2 min-h-[20px]">
                                {media.title.romaji}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {index < array.length - 1 && <MyDivider />}
                  </div>
                ))}
              </div>

              <MyDivider />

              <div className="flex flex-col gap-4">
                <div className="grid px-4 flex-col gap-4 rounded">
                  <strong className="text-lg font-medium uppercase font-sans">
                    Anime Staff Roles
                  </strong>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4">
                    {staff.staffMedia.edges.map((edge, index) => (
                      <div
                        className="flex bg-zinc-50 shadow-md rounded overflow-hidden"
                        key={index}
                      >
                        <Link
                          to={`/anime/${edge.node.id}`}
                          title={edge.node.title.romaji}
                        >
                          <div className="bg-gradient-to-t from-zinc-600 via-zinc-400 to-zinc-300 w-28">
                            <img
                              src={edge.node.coverImage.large}
                              alt={edge.node.title.romaji}
                              style={{
                                opacity: 0,
                                transitionDuration: "700ms",
                              }}
                              onLoad={(t) =>
                                (t.currentTarget.style.opacity = "1")
                              }
                              className="aspect-[6_/_9] object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex flex-col gap-1 p-2">
                          <Link
                            to={`/anime/${edge.node.id}`}
                            title={edge.node.title.romaji}
                          >
                            <span className="text-sm font-medium line-clamp-2">
                              {edge.node.title.romaji}
                            </span>
                          </Link>

                          <span className="text-sm text-main">
                            {edge.staffRole}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Grow>
        </div>
      )}

      <MyDivider />

      <Footer />
    </div>
  );
}
