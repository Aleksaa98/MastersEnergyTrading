import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";
import guest from "../assets/images/users/guest.jpg";

const navigation = [
  {
    title: "Dashboard",
    href: "/starter",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Battery",
    href: "/battery",
    icon: "bi bi-battery",
  },
  {
    title: "Users",
    href: "/users",
    icon: "bi bi-people",
  },
  {
    title: "Market",
    href: "/market",
    icon: "bi bi-graph-up",
  },
  {
    title: "Strategies",
    href: "/strategies",
    icon: "bi bi-lightbulb",
  },
];

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

   const filteredNavigation = navigation.filter((navi) => {
    if (!user) {
      // Guest user
      return navi.title !== "Battery" && navi.title !== "Users";
    } else if (user.type === "admin") {
      // Admin user
      return navi.title !== "Strategies"; // hide strategies
    } else if (user.type === "customer") {
      // Regular logged-in user
      return navi.title !== "Users"; // hide users and strategies
    }
    return true;
  });

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div
        className="profilebg"
        style={{ background: `url(${probg}) no-repeat` }}
      >
        <div className="p-3 d-flex">
          {user !== null ? (
            <Link to="/profile">
              <img
                src={user1}
                alt="user"
                width="50"
                className="rounded-circle hover-effect"
              />
            </Link>
          ) : (
            <Link to="/login">
              <img
                src={guest}
                alt="guest"
                width="50"
                className="rounded-circle hover-effect"
              />
            </Link>
          )}
          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={showMobilemenu}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        {user && (
          <div className="bg-dark text-white p-2 opacity-75">
            {user.fullName}
          </div>
        )}
      </div>
      <div className="p-3 mt-2">
        <Nav vertical className="sidebarNav">
          {filteredNavigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
