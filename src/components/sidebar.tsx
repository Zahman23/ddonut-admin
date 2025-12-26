"use client";

import {
  ChevronRight,
  Image,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Star,
  Tag,
  User,
  User2,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useStoreDashboard } from "@/stores/use-store-dashboard";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import StoreSwitcher from "./store-switcher";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useStoreAccess } from "@/hooks/use-store-access";
import { cn } from "@/lib/utils";

type User = {
  role: string | undefined;
  email: string | undefined;
};

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { section, sectionActive } = useStoreDashboard();
  const [bannerDropdownOpen, setBannerDropdownOpen] = useState(false);
  const { storeId } = useParams();
  const pathName = usePathname();
  const router = useRouter();

  const { user, stores, role, loading, error, refresh } = useStoreAccess();

  const superAdmin = !(user?.role === "superAdmin" || user?.role === "owner");

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/${storeId}`,
      active: pathName === `/${storeId}`,
    },
    {
      id: "banners",
      label: "Banners",
      icon: Image,
      href: `/${storeId}/banners`,
      active: pathName === `/${storeId}/banners`,
    },
    {
      id: "categories",
      label: "Categories",
      icon: Tag,
      href: `/${storeId}/categories`,
      active: pathName === `/${storeId}/categories`,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      href: `/${storeId}/products`,
      active: pathName === `/${storeId}/products`,
    },
    {
      id: "users",
      label: "User Management",
      icon: User2,
      href: `/${storeId}/users`,
      active: pathName === `/${storeId}/users`,
    },
  ];

  const bannerItems = [
    {
      id: "home-banner",
      label: "Home Banner",
      href: `/${storeId}/banners/home`,
      active: pathName === `/${storeId}/banners/home`,
    },
    {
      id: "category-banner",
      label: "Category Banner",
      href: `/${storeId}/banners/category`,
      active: pathName === `/${storeId}/banners/category`,
    },
  ];

  const filteredMenu = superAdmin ? menuItems.slice(0, 4) : menuItems;

  const handleNavigation = (id: string) => {
    sectionActive(id);
    onNavigate?.();
  };

  const handleLogout = async () => {
    try {
      router.push("/login?mode=sign-in");
      const body = await axios.get("/api/auth/logout");
    } catch (error) {
      console.log("Error", error);
      toast.success("Logout gagal");
    }
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Banner Section */}
      <div className="p-6 bg-gradient-to-r from-secondary to-accent text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Dashboard</h1>
            <p className="text-sm text-white/80">Admin Panel</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {!loading ? (
            <>
              {!superAdmin ? (
                <StoreSwitcher items={stores} />
              ) : (
                <>
                  {stores.map((name) => (
                    <Badge
                      key={name.id}
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      {name.name}
                    </Badge>
                  ))}
                </>
              )}
            </>
          ) : (
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              Loading...
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <nav className="space-y-2">
            {filteredMenu.map((item) => {
              const Icon = item.icon;

              if (item.id === "banners") {
                return (
                  <div key={item.id}>
                    <Button
                      variant={
                        bannerItems.some((i) => item.id === i.id)
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-between gap-3 cursor-pointer font-normal",
                        bannerItems.some((i) => item.id === i.id)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      onClick={() => setBannerDropdownOpen((prev) => !prev)}
                    >
                      <div className="flex items-center gap-3 text-md">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          bannerDropdownOpen ? "rotate-90" : ""
                        )}
                      />
                    </Button>

                    {bannerDropdownOpen && (
                      <div className="ml-4 space-y-1">
                        {bannerItems.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href || ""}
                            className={cn(
                              "w-full justify-start flex items-center p-2 rounded-md  gap-3",
                              subItem.active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                          >
                            <p className="text-sm">{subItem.label}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href || ""}
                  className={`w-full justify-start flex items-center p-2 rounded-md text-md  gap-3 ${
                    item.active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                  onClick={() => handleNavigation(item.id || "")}
                >
                  <Icon className="w-5 h-5" />

                  <p className="text-sm">{item.label}</p>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-6" />

          {/* Quick Stats */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-sidebar-foreground/70">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-sidebar-foreground/70">
                  Total Products
                </span>
                <span className="font-medium text-sidebar-foreground">
                  1,247
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sidebar-foreground/70">Categories</span>
                <span className="font-medium text-sidebar-foreground">24</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sidebar-foreground/70">
                  Active Orders
                </span>
                <span className="font-medium text-accent">89</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - User Profile & Settings */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        <div className="space-y-2">
          {/* Settings Button */}
          <Link
            onClick={() => handleNavigation("settings")}
            href={`/${storeId}/settings`}
            className="`w-full justify-start flex items-center p-2 rounded-md  gap-3"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="flex items-center gap-3 truncate">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="text-left ">
                    <p className="text-sm font-medium ">{user?.email ?? ""}</p>
                    <p className="text-xs text-sidebar-foreground/70">
                      {user?.role}
                    </p>
                  </div>
                  {/* <ChevronDown className="w-4 h-4" /> */}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
