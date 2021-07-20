import ManageGrups from "../components/grup/ManageGrups";
import Grup from "../components/grup/Grup";
import GrupAdd from "../components/grup/GrupAdd";
import GrupEdit from "../components/grup/GrupEdit";
import User from "../components/user/User";
import UserAdd from "../components/user/UserAdd";
import UserEdit from "../components/user/UserEdit";
import ManageUsers from "../components/user/ManageUsers";

const routes = [
  {
    path: "/users/:userId/edit",
    component: UserEdit,
    isPrivate: false,
  },

  {
    path: "/users",
    component: ManageUsers,
    isPrivate: false,
  },

  {
    path: "/add",
    component: UserAdd,
    isPrivate: false,
  },
  {
    path: "/grups/add",
    component: GrupAdd,
    isPrivate: false,
  },
  {
    path: "/grups/:grupId/edit",
    component: GrupEdit,
    isPrivate: false,
  },

  {
    path: "/grup/:grupId",
    component: Grup,
    isPrivate: false,
  },
  {
    path: "/user/:userId",
    component: User,
    isPrivate: false,
  },
  {
    path: "/grup",
    components: Grup,

    isPrivate: false,
  },

  {
    path: "/",
    components: ManageGrups,

    isPrivate: false,
  },
];

export default routes;
