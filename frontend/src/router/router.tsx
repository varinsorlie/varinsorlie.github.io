//import { createBrowserRouter } from "react-router-dom"
import Home from "../components/Homepage.js";
import { ListPage } from "../components/ListPage.js";
import { Layout } from "../components/Layout.js";
import Blog from "../components/BlogPage.js";
import type { RouteObject } from "react-router-dom";
import CVPage from "../components/CvPage.js";
import TravelPage from "../components/TravelPage.js";
import TravelDetailPage from "../components/TravelDetailPage.js";
import MapPage from "../components/MapPage.js";
import BirthdayPage from "../components/BirthdayPage.js";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: ":slug", Component: ListPage },
      { path: "blog", Component: Blog },
      { path: "cvPage", Component: CVPage},
      
      { path: "travelPage", Component: TravelPage},
      { path: "travel/:slug", Component: TravelDetailPage },
      { path: "mapPage", Component: MapPage},
      { path: "BirthdayPage", Component: BirthdayPage}
    ],
  },
];