import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { BarChart3, Boxes, CarFront, ChevronDown, CircleDollarSign, ClipboardList, LayoutDashboard, LogOut, Menu, Package, ReceiptText, Settings2, ShoppingCart, Truck, Users, WalletCards, X, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navigation = [
  { label: "Overview", path: "/", icon: LayoutDashboard, roles: ["owner", "admin", "manager", "sales", "storekeeper", "accountant", "user"] },
  { label: "Sales & invoices", path: "/sales", icon: ShoppingCart, roles: ["owner", "admin", "manager", "sales", "accountant"] },
  { label: "Barcode quick sale", path: "/barcode-sale", icon: Package, roles: ["owner", "admin", "manager", "sales", "storekeeper"] },
  { label: "Purchasing", path: "/purchases", icon: Truck, roles: ["owner", "admin", "manager", "storekeeper", "accountant"] },
  { label: "Inventory", path: "/inventory", icon: Boxes, roles: ["owner", "admin", "manager", "storekeeper"] },
  { label: "Products", path: "/products", icon: Package, roles: ["owner", "admin", "manager", "storekeeper"] },
  { label: "Customers", path: "/customers", icon: Users, roles: ["owner", "admin", "manager", "sales", "accountant"] },
  { label: "Customer due", path: "/customer-due", icon: CircleDollarSign, roles: ["owner", "admin", "manager", "sales", "accountant"] },
  { label: "Suppliers", path: "/suppliers", icon: ClipboardList, roles: ["owner", "admin", "manager", "accountant"] },
  { label: "Expenses", path: "/expenses", icon: WalletCards, roles: ["owner", "admin", "manager", "accountant"] },
  { label: "Daily closing", path: "/daily-closing", icon: CircleDollarSign, roles: ["owner", "admin", "manager", "accountant"] },
  { label: "Ledgers", path: "/ledger", icon: ReceiptText, roles: ["owner", "admin", "manager", "sales", "accountant"] },
  { label: "Returns", path: "/returns", icon: RotateCcw, roles: ["owner", "admin", "manager", "sales", "storekeeper"] },
  { label: "Reports", path: "/reports", icon: BarChart3, roles: ["owner", "admin", "manager", "sales", "storekeeper", "accountant"] },
  { label: "Shop settings", path: "/settings", icon: Settings2, roles: ["owner", "admin", "manager"] },
  { label: "Print studio", path: "/print-templates", icon: ReceiptText, roles: ["owner", "admin", "manager", "sales", "accountant"] },
  { label: "Due reminders", path: "/reminders", icon: WalletCards, roles: ["owner", "admin", "manager", "sales", "accountant"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: shopSettings } = trpc.settings.get.useQuery(undefined, { enabled: Boolean(user) });
  if (loading) return <div className="min-h-screen grid place-items-center bg-[#f7f9fc] text-slate-500">Loading workspace…</div>;
  if (!user) return <div className="min-h-screen grid place-items-center bg-[#f7f9fc] p-6"><div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl shadow-slate-200/60"><div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[#10243f] text-white"><CarFront /></div><h1 className="text-2xl font-semibold text-[#10243f]">Welcome to Motive Ledger</h1><p className="mt-3 text-sm leading-6 text-slate-500">Sign in to manage inventory, sales, purchasing and business finances.</p><button onClick={() => startLogin()} className="mt-7 w-full rounded-xl bg-[#ef8354] px-4 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">Sign in to workspace</button></div></div>;
  const role = user.role === "admin" ? "owner" : user.role;
  const visibleNav = navigation.filter(item => item.roles.includes(role));
  return <div className="min-h-screen bg-[#f7f9fc] text-[#10243f]">
    {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-[#10243f]/30 lg:hidden" onClick={() => setMobileOpen(false)} />}
    <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-slate-200 bg-[#10243f] text-white transition-transform lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ef8354] shadow-lg shadow-orange-950/20"><CarFront size={21} /></div><div><p className="text-sm font-bold tracking-wide">MOTIVE LEDGER</p><p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Auto operations</p></div></div><button className="lg:hidden" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
      <div className="px-4 pt-7"><p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p><nav className="mt-3 space-y-1">{visibleNav.map(item => { const active = location === item.path || (item.path === "/" && location === "/"); return <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}><span className={cn("group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-white text-[#10243f] shadow-lg shadow-slate-950/10" : "text-slate-300 hover:bg-white/10 hover:text-white")}><item.icon size={17} className={active ? "text-[#ef8354]" : "text-slate-500 group-hover:text-[#ef8354]"} /><span>{item.label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ef8354]" />}</span></Link> })}</nav></div>
      <div className="mt-auto border-t border-white/10 p-4"><div className="mb-3 rounded-2xl bg-white/5 p-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#ef8354] text-sm font-bold">{user.name?.slice(0, 1).toUpperCase() || "U"}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name || "Workspace user"}</p><p className="mt-0.5 truncate text-xs text-slate-300">{user.email || "No email on account"}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#ef8354]">{role} access</p></div><ChevronDown size={15} className="ml-auto text-slate-500" /></div></div><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"><LogOut size={16} />Sign out</button></div>
    </aside>
    <main className="min-h-screen lg:pl-[264px]"><header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-[#f7f9fc]/90 px-5 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><button className="rounded-xl border border-slate-200 bg-white p-2 lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Operations center</p><p className="mt-1 text-sm font-semibold text-[#10243f]">{navigation.find(item => item.path === location)?.label || "Overview"}</p></div></div><div className="flex items-center gap-3"><div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:block">21 Aug 2026 <span className="mx-2 text-slate-300">•</span> Dhaka</div><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#10243f] text-sm font-bold text-white">{user.name?.slice(0, 1).toUpperCase() || "U"}</div></div></header><div className="px-5 py-7 sm:px-8 lg:px-10">{children}<footer className="mt-10 border-t border-slate-200 py-5 text-center text-[11px] text-slate-400 print:mt-6 print:block">{shopSettings?.copyrightFooter || "All rights Reserve by Nazmus Sakib"}</footer></div></main>
  </div>;
}
