"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CreditCard,
  History,
  ArrowUpCircle,
} from "lucide-react";
import { SuperAdminSidebar } from "@/components/ui/super-admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock transactions data
const mockTransactions = [
  {
    id: "1",
    collegeId: "1",
    collegeName: "MIT College of Engineering",
    type: "credit" as const,
    amount: 500,
    description: "Initial credit allocation",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "Admin User",
  },
  {
    id: "2",
    collegeId: "1",
    collegeName: "MIT College of Engineering",
    type: "credit" as const,
    amount: 200,
    description: "Additional credits for Q1 2024",
    createdAt: "2024-02-20T14:15:00Z",
    createdBy: "Admin User",
  },
  {
    id: "3",
    collegeId: "1",
    collegeName: "MIT College of Engineering",
    type: "debit" as const,
    amount: -50,
    description: "Interview usage",
    createdAt: "2024-03-10T09:00:00Z",
    createdBy: "System",
  },
  {
    id: "4",
    collegeId: "2",
    collegeName: "IIT Delhi",
    type: "credit" as const,
    amount: 1000,
    description: "Bulk credit purchase",
    createdAt: "2024-02-20T11:20:00Z",
    createdBy: "Admin User",
  },
  {
    id: "5",
    collegeId: "2",
    collegeName: "IIT Delhi",
    type: "debit" as const,
    amount: -25,
    description: "Interview usage",
    createdAt: "2024-03-15T16:45:00Z",
    createdBy: "System",
  },
];

// Mock data - replace with API calls later
const mockColleges = [
  {
    id: "1",
    name: "MIT College of Engineering",
    code: "MIT001",
    location: "Pune, Maharashtra",
    email: "contact@mitcoe.edu.in",
    phone: "+91-20-12345678",
    totalStudents: 1250,
    status: "active",
    createdAt: "2024-01-15",
    credits: 650,
  },
  {
    id: "2",
    name: "IIT Delhi",
    code: "IITD001",
    location: "New Delhi",
    email: "admin@iitd.ac.in",
    phone: "+91-11-26591750",
    totalStudents: 8500,
    status: "active",
    createdAt: "2024-02-20",
    credits: 975,
  },
  {
    id: "3",
    name: "Stanford University",
    code: "STF001",
    location: "California, USA",
    email: "info@stanford.edu",
    phone: "+1-650-723-2300",
    totalStudents: 720,
    status: "active",
    createdAt: "2024-03-10",
    credits: 300,
  },
  {
    id: "4",
    name: "Harvard Business School",
    code: "HBS001",
    location: "Boston, Massachusetts",
    email: "admissions@hbs.edu",
    phone: "+1-617-495-6127",
    totalStudents: 450,
    status: "inactive",
    createdAt: "2024-01-05",
    credits: 150,
  },
  {
    id: "5",
    name: "Oxford University",
    code: "OXF001",
    location: "Oxford, UK",
    email: "admin@oxford.ac.uk",
    phone: "+44-1865-270000",
    totalStudents: 320,
    status: "active",
    createdAt: "2024-04-12",
    credits: 500,
  },
];

interface Transaction {
  id: string;
  collegeId: string;
  collegeName: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  createdAt: string;
  createdBy: string;
}

interface College {
  id: string;
  name: string;
  code: string;
  location: string;
  email: string;
  phone: string;
  totalStudents: number;
  status: "active" | "inactive";
  createdAt: string;
  credits: number;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>(mockColleges);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddCreditsDialogOpen, setIsAddCreditsDialogOpen] = useState(false);
  const [isTransactionsDialogOpen, setIsTransactionsDialogOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDescription, setCreditDescription] = useState("");
  const [viewingCollegeTransactions, setViewingCollegeTransactions] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
    credits: 0,
  });

  // Filter colleges based on search
  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      location: "",
      email: "",
      phone: "",
      status: "active",
      credits: 0,
    });
    setSelectedCollege(null);
  };

  // Handle create
  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (college: College) => {
    setSelectedCollege(college);
    setFormData({
      name: college.name,
      code: college.code,
      location: college.location,
      email: college.email,
      phone: college.phone,
      status: college.status,
      credits: college.credits,
    });
    setIsEditDialogOpen(true);
  };

  // Handle add credits
  const handleAddCredits = (college: College) => {
    setSelectedCollege(college);
    setCreditAmount("");
    setCreditDescription("");
    setIsAddCreditsDialogOpen(true);
  };

  // Handle view transactions
  const handleViewTransactions = (collegeId?: string) => {
    if (collegeId) {
      setViewingCollegeTransactions(collegeId);
    } else {
      setViewingCollegeTransactions(null);
    }
    setIsTransactionsDialogOpen(true);
  };

  // Get filtered transactions
  const getFilteredTransactions = () => {
    if (viewingCollegeTransactions) {
      return transactions.filter((t) => t.collegeId === viewingCollegeTransactions);
    }
    return transactions;
  };

  // Handle delete
  const handleDelete = async (college: College) => {
    if (!confirm(`Are you sure you want to delete ${college.name}?`)) {
      return;
    }

    setIsDeleting(true);
    // TODO: Replace with API call
    setTimeout(() => {
      setColleges(colleges.filter((c) => c.id !== college.id));
      setIsDeleting(false);
      toast.success("College deleted successfully");
    }, 500);
  };

  // Submit add credits
  const handleAddCreditsSubmit = () => {
    if (!selectedCollege) return;

    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    if (!creditDescription.trim()) {
      toast.error("Please enter a description");
      return;
    }

    // TODO: Replace with API call
    // Update college credits
    setColleges(
      colleges.map((c) =>
        c.id === selectedCollege.id
          ? { ...c, credits: c.credits + amount }
          : c
      )
    );

    // Add transaction
    const newTransaction: Transaction = {
      id: String(transactions.length + 1),
      collegeId: selectedCollege.id,
      collegeName: selectedCollege.name,
      type: "credit",
      amount: amount,
      description: creditDescription,
      createdAt: new Date().toISOString(),
      createdBy: "Admin User",
    };

    setTransactions([newTransaction, ...transactions]);
    setIsAddCreditsDialogOpen(false);
    setCreditAmount("");
    setCreditDescription("");
    toast.success(`${amount} credits added successfully`);
  };

  // Submit create
  const handleCreateSubmit = () => {
    // Validation
    if (!formData.name || !formData.code || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // TODO: Replace with API call
    const newCollege: College = {
      id: String(colleges.length + 1),
      ...formData,
      totalStudents: 0,
      createdAt: new Date().toISOString().split("T")[0],
      credits: formData.credits || 0,
    };

    setColleges([...colleges, newCollege]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success("College created successfully");
  };

  // Submit edit
  const handleEditSubmit = () => {
    if (!selectedCollege) return;

    // Validation
    if (!formData.name || !formData.code || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // TODO: Replace with API call
    setColleges(
      colleges.map((c) =>
        c.id === selectedCollege.id
          ? { ...c, ...formData }
          : c
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("College updated successfully");
  };

  return (
    <SuperAdminSidebar
      headerContent={
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">Colleges Management</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleViewTransactions()}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              All Transactions
            </Button>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Add College
            </Button>
          </div>
        </div>
      }
    >
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search colleges by name, code, location, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredColleges.length} of {colleges.length} colleges
            </div>
          </div>

          {/* Colleges Table */}
          <div className="rounded-lg border border-sidebar-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColleges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No colleges found. {searchQuery && "Try a different search term."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredColleges.map((college) => (
                    <TableRow key={college.id}>
                      <TableCell className="font-medium">{college.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {college.code}
                        </code>
                      </TableCell>
                      <TableCell>{college.location}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{college.email}</div>
                          <div className="text-xs text-muted-foreground">{college.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{college.totalStudents.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            {college.credits.toLocaleString()}
                          </span>
                          {college.credits < 100 && (
                            <Badge variant="destructive" className="text-xs">
                              Low
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={college.status === "active" ? "default" : "secondary"}
                        >
                          {college.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAddCredits(college)}>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Add Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewTransactions(college.id)}
                            >
                              <History className="mr-2 h-4 w-4" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(college)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(college)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New College</DialogTitle>
            <DialogDescription>
              Add a new college to the system. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  College Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="MIT College of Engineering"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">
                  College Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="MIT001"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder="Pune, Maharashtra"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@college.edu"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91-20-12345678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>Create College</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit College</DialogTitle>
            <DialogDescription>
              Update college information. Make changes and click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">
                  College Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  placeholder="MIT College of Engineering"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">
                  College Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-code"
                  placeholder="MIT001"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-location"
                placeholder="Pune, Maharashtra"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="contact@college.edu"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="+91-20-12345678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Credits Dialog */}
      <Dialog open={isAddCreditsDialogOpen} onOpenChange={setIsAddCreditsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Interview Credits</DialogTitle>
            <DialogDescription>
              Add credits to {selectedCollege?.name}. These credits will be used for interviews.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border border-sidebar-border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Credits</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedCollege?.credits.toLocaleString() || 0}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit-amount">
                Credit Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="credit-amount"
                type="number"
                min="1"
                placeholder="Enter credit amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Input
                id="credit-description"
                placeholder="e.g., Monthly allocation, Bulk purchase, etc."
                value={creditDescription}
                onChange={(e) => setCreditDescription(e.target.value)}
              />
            </div>
            {creditAmount && parseInt(creditAmount) > 0 && (
              <div className="rounded-lg border border-sidebar-border bg-muted/30 p-3">
                <div className="text-sm text-muted-foreground">
                  New balance after adding credits:
                </div>
                <div className="text-xl font-bold text-primary mt-1">
                  {(
                    (selectedCollege?.credits || 0) + parseInt(creditAmount || "0")
                  ).toLocaleString()}{" "}
                  credits
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddCreditsDialogOpen(false);
                setCreditAmount("");
                setCreditDescription("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCreditsSubmit} className="gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Add Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transactions Dialog */}
      <Dialog open={isTransactionsDialogOpen} onOpenChange={setIsTransactionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              {viewingCollegeTransactions
                ? `All credit transactions for ${
                    colleges.find((c) => c.id === viewingCollegeTransactions)?.name
                  }`
                : "All credit transactions across all colleges"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {getFilteredTransactions().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredTransactions().map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.collegeName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "credit" ? "default" : "secondary"
                          }
                        >
                          {transaction.type === "credit" ? "Credit" : "Debit"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            transaction.amount > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.createdBy}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminSidebar>
  );
}

