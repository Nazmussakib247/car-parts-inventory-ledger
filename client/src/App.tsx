import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/products" component={Home} /><Route path="/customers" component={Home} /><Route path="/customer-due" component={Home} /><Route path="/history/:type/:id" component={Home} /><Route path="/suppliers" component={Home} /><Route path="/inventory" component={Home} /><Route path="/sales" component={Home} /><Route path="/purchases" component={Home} /><Route path="/expenses" component={Home} /><Route path="/daily-closing" component={Home} /><Route path="/ledger" component={Home} /><Route path="/ledgers" component={Home} /><Route path="/returns" component={Home} /><Route path="/reports" component={Home} /><Route path="/settings" component={Home} /><Route path="/print-templates" component={Home} /><Route path="/reminders" component={Home} /><Route path="/barcode-sale" component={Home} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
