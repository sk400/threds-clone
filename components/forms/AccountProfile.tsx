"use client";

import { userValidation } from "@/lib/validations/userValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { ChangeEvent, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/lib/serverActions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  btnTitle: string;
  userData: {
    userId: string;
    username: string;
    name: string;
    image: string;
    bio: string;
  };
}

const AccountProfile = ({ btnTitle, userData }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: userData.image ? userData.image : "",
      name: userData.name ? userData.name : "",
      username: userData.username ? userData.username : "",
      bio: userData.bio ? userData.bio : "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e?.target?.files[0];

      if (!file.type.includes("image")) return;

      setFiles(Array.from(e.target.files));

      fileReader.onload = async (event) => {
        const imageUrl = event?.target?.result?.toString() || "";
        fieldChange(imageUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    try {
      const blob = values.profile_photo;

      const hasImageChanged = isBase64Image(blob);

      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.profile_photo = imgRes[0].url;
        }
      }

      await updateUser({
        userId: userData.userId,
        username: values.username,
        name: values.name,
        image: values.profile_photo,
        bio: values.bio,
        path: pathname,
      });

      if (pathname === "/profile/edit") {
        router.back();
      } else {
        router.push("/");
      }

      console.log("submitted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10"
        >
          {/* Profile image */}

          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? (
                    <Image
                      src={field.value}
                      width={96}
                      height={96}
                      alt="profile_photo"
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      width={24}
                      height={24}
                      alt="profile_photo"
                      className="rounded-full object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Add a profile photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Name
                </FormLabel>
                <FormControl className="account-form_input no-focus">
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Username
                </FormLabel>
                <FormControl className="account-form_input no-focus">
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="account-form_input no-focus"
                    rows={10}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            {btnTitle}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AccountProfile;
