"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { DotsThreeVerticalIcon, SignOutIcon } from "@phosphor-icons/react"

interface Props {
  user: { email: string; name: string }
  onSignOut: () => void
}

export const AdminNavUser = ({ user, onSignOut }: Props) => {
  const { isMobile } = useSidebar()
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-violet-600 text-white text-xs font-mono">
                  {initials || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium font-mono">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground font-mono">{user.email}</span>
              </div>
              <DotsThreeVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="px-2 py-1.5 text-xs text-muted-foreground font-mono">{user.email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="font-mono text-sm cursor-pointer text-red-400 focus:text-red-400">
              <SignOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
