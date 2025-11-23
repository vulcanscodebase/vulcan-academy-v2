"use client";

import { useState } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authcontext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Loader } from "../ui/loader";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
}

interface Props {
  course: Course;
  openModal: (desc: string) => void;
}

export function CourseCardPublic({ course, openModal }: Props) {
  const { user } = useAuth();
  const { addItemToCart, isItemInCart, setIsCartOpen } = useCart();
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      toast.warn("Please sign in to add items to the cart.");
      return router.push("/signin");
    }
    if (isItemInCart(course._id)) {
      setIsCartOpen(true);
      return;
    } else {
      await addItemToCart(course._id, "Course", 1, setLoadingAddToCart);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 w-full max-w-sm">
      <img
        src={course.thumbnail}
        alt={`${course.title} logo`}
        className="rounded-md w-full h-48 object-cover"
      />

      <h2 className="text-lg font-semibold mt-3 text-gray-900 dark:text-white">
        {course.title}
      </h2>

      <p
        className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: course.description }}
      />

      <div className="mt-3 flex justify-between items-center">
        <p className="font-semibold text-gray-800 dark:text-gray-200">
          ₹{course.price}
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          onClick={() => openModal(course.description)}
        >
          Know More
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          onClick={handleAddToCart}
          disabled={loadingAddToCart}
        >
          {!isItemInCart(course._id) ? (
            <>
              {loadingAddToCart ? (
                <Loader />
              ) : (
                <>
                  Add To Cart <BsCartPlusFill />{" "}
                </>
              )}
            </>
          ) : (
            "Go To Cart"
          )}
        </button>
      </div>
    </div>
  );
}
