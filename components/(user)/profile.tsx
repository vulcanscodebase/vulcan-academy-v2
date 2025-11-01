"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import profile_placeholder from "@/public/about.jpg";
import { useAuth } from "../context/authcontext";
import { updateUserById } from "../api";
import { requestHandler } from "@/utils/auth";

interface FormDataType {
  name: string;
  dob: string;
  email: string;
  profilePhoto: string;
  educationStatus: string;
  schoolOrCollege: string;
  profession: string;
  organization: string;
  qualification: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

export function ProfileSetup() {
  const { user, getUserProfileStatus, getUser, handleModal } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    dob: "",
    email: "",
    profilePhoto: profile_placeholder.src,
    educationStatus: "",
    schoolOrCollege: "",
    profession: "",
    organization: "",
    qualification: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState("");

  const initialFormData = useRef<FormDataType>({ ...formData });

  // ✅ Update formData whenever user is loaded
  useEffect(() => {
    if (user) {
      const updatedForm: FormDataType = {
        name: user.name || "",
        dob: formatDate((user as any).dob),
        email: user.email || "",
        profilePhoto: (user as any).profilePhoto || profile_placeholder.src,
        educationStatus: (user as any).educationStatus || "",
        schoolOrCollege: (user as any).schoolOrCollege || "",
        profession: (user as any).profession || "",
        organization: (user as any).organization || "",
        qualification: (user as any).qualification || "",
      };
      setFormData(updatedForm);
      initialFormData.current = updatedForm;
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData(initialFormData.current);
    setIsEditMode(false);
    setApiErrorMsg("");
  };

  const handleSave = async () => {
    if (!user?.id) {
      handleModal("User not found. Please login again.");
      return;
    }

    // ✅ Validation
    if (!formData.profession) return toast.error("Profession is required");

    if (formData.profession === "Student") {
      if (!formData.educationStatus) return toast.error("Education status is required");
      if (!formData.schoolOrCollege) return toast.error("School/College is required");
    }

    if (formData.profession === "IT Profession" && !formData.organization)
      return toast.error("Organization is required");

    if (
      (formData.profession === "Job Seeker" ||
        formData.profession === "Aspirant Studying Abroad") &&
      !formData.qualification
    )
      return toast.error("Qualification is required");

    setIsLoading(true);
    setApiErrorMsg("");

    try {
      // Only send editable fields
      const editableFields: (keyof FormDataType)[] = [
        "profession",
        "educationStatus",
        "schoolOrCollege",
        "qualification",
        "organization",
      ];

      const modifiedFields: Partial<FormDataType> = {};
      editableFields.forEach((key) => {
        if (formData[key] !== initialFormData.current[key]) {
          modifiedFields[key] = formData[key];
        }
      });

      if (Object.keys(modifiedFields).length === 0) {
        handleModal("No changes were made.");
        setIsLoading(false);
        return;
      }

      // Map keys to snake_case if backend requires
      const apiPayload = {
        profession: modifiedFields.profession,
        education_status: modifiedFields.educationStatus,
        school_or_college: modifiedFields.schoolOrCollege,
        qualification: modifiedFields.qualification,
        organization: modifiedFields.organization,
      };

      await requestHandler(
        async () => await updateUserById(user.id, apiPayload),
        setIsLoading,
        () => {
          getUserProfileStatus();
          getUser();
          setIsEditMode(false);
          initialFormData.current = { ...formData };
          handleModal("Profile updated successfully!");
          toast.success("Profile saved!");
          router.push("/user-dash");
        },
        () => {
          setApiErrorMsg("Error updating profile!");
          handleModal("Error updating profile!");
        }
      );
    } catch (error) {
      setApiErrorMsg("Unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-28 pb-16 bg-vulcan-bg min-h-screen px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border border-vulcan-border shadow-lg bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="mt-4 text-2xl font-semibold text-vulcan-dark">
              My Profile
            </div>
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-vulcan-accent-blue shadow-lg">
              <Image
                src={formData.profilePhoto || profile_placeholder.src}
                alt="Profile"
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            </div>
            <CardTitle className="mt-4 text-2xl font-semibold text-vulcan-dark">
              {formData.name}
            </CardTitle>

            {!isEditMode && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsEditMode(true)}
              >
                Update Profile
              </Button>
            )}
          </CardHeader>

          {apiErrorMsg && (
            <p className="text-red-600 text-center text-sm font-medium">
              {apiErrorMsg}
            </p>
          )}

          <CardContent className="space-y-6 px-6">
            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                Name
              </label>
              <Input
                name="name"
                value={formData.name}
                disabled
                className="bg-white/70 w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                Email
              </label>
              <Input
                name="email"
                value={formData.email}
                disabled
                className="bg-white/70 w-full"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                Date of Birth
              </label>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                disabled
                className="bg-white/70 w-full"
              />
            </div>

            {/* Editable fields */}
            <div>
              <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                Profession
              </label>
              <Select
                disabled={!isEditMode}
                onValueChange={(value) => handleSelectChange("profession", value)}
                value={formData.profession}
              >
                <SelectTrigger className="bg-white/70 w-full">
                  <SelectValue placeholder="Select Profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Job Seeker">Job Seeker</SelectItem>
                  <SelectItem value="IT Profession">IT Profession</SelectItem>
                  <SelectItem value="Aspirant Studying Abroad">
                    Aspirant Studying Abroad
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                Education Status
              </label>
              <Select
                disabled={!isEditMode}
                onValueChange={(value) => handleSelectChange("educationStatus", value)}
                value={formData.educationStatus}
              >
                <SelectTrigger className="bg-white/70 w-full">
                  <SelectValue placeholder="Select Education Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10th or below">10th or below</SelectItem>
                  <SelectItem value="11th-12th or diploma">11th–12th / Diploma</SelectItem>
                  <SelectItem value="Undergrad">Undergrad</SelectItem>
                  <SelectItem value="Grad">Grad</SelectItem>
                  <SelectItem value="Post Grad">Post Grad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                School / College
              </label>
              <Input
                name="schoolOrCollege"
                value={formData.schoolOrCollege}
                disabled={!isEditMode}
                onChange={handleInputChange}
                className="bg-white/70 w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                Qualification
              </label>
              <Input
                name="qualification"
                value={formData.qualification}
                disabled={!isEditMode}
                onChange={handleInputChange}
                className="bg-white/70 w-full"
              />
            </div>

            {formData.profession === "IT Profession" && (
              <div>
                <label className="text-sm font-medium mb-1 block text-vulcan-dark">
                  Organization
                </label>
                <Input
                  name="organization"
                  value={formData.organization}
                  disabled={!isEditMode}
                  onChange={handleInputChange}
                  className="bg-white/70 w-full"
                />
              </div>
            )}
          </CardContent>

          {isEditMode && (
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 px-6 pb-6">
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={handleCancel}
                className="w-full sm:w-auto border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full sm:w-auto bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90"
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  );
}
