"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar"
import Image from "next/image"
import { KeyboardIcon, ImageSquareIcon, ArrowLeftIcon } from "@phosphor-icons/react"
import { AdminNavUser } from "./admin-nav-user"

type AdminSection = "key-health" | "custom-ads"

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
  { id: "key-health", label: "Key Health",        icon: <KeyboardIcon /> },
  { id: "custom-ads", label: "Custom Ads",        icon: <ImageSquareIcon /> },
]

interface AdminSidebarProps extends Omit<React.ComponentProps<typeof Sidebar>, "onSelect"> {
  activeSection: AdminSection
  onSelect: (section: AdminSection) => void
  user: { email: string; name: string }
  onSignOut: () => void
}

export function AdminSidebar({ activeSection, onSelect, user, onSignOut, ...props }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/">
                <Image
                  src="/keyboard.png"
                  alt="KeyTester.io logo"
                  width={24}
                  height={24}
                  className="size-6 shrink-0 select-none"
                />
                <span className="text-base font-semibold font-mono">KeyTester</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-wider">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton tooltip={item.label} isActive={activeSection === item.id} onClick={() => onSelect(item.id)} className="font-mono text-sm cursor-pointer">
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Tester" className="font-mono text-sm text-muted-foreground">
                  <a href="/"><ArrowLeftIcon /><span>Back to Tester</span></a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <AdminNavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
