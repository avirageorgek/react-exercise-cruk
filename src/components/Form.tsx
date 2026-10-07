import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, TextField, Select } from "@cruk/cruk-react-components";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import styled from "styled-components";
import { NasaSearchParams } from "../types";

const FieldSet = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
`;

export const formSchema = z.object({
  keywords: z
    .string()
    .min(2, "keywords must have at least 2 characters.")
    .max(50, "keywords must have at most 50 characters."),
  mediaType: z.enum(["audio", "video", "image"], {
    message: "Please select a media type.",
  }),
  yearStart: z.string().superRefine((val, ctx) => {
    if (val === "") return;
    const year = Number(val);
    const currentYear = new Date().getFullYear();
    if (!/^\d+$/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter a valid number.",
      });
      return;
    }

    if (year < 1900) {
      ctx.addIssue({
        code: "custom",
        message: "Year start must be after 1900.",
      });
    } else if (year > currentYear) {
      ctx.addIssue({
        code: "custom",
        message: "Year start must not be in the future.",
      });
    }
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export const initialData = {
  keywords: "",
  mediaType: "",
  yearStart: "",
} as unknown as FormValues;

export function Form({
  setValues,
}: {
  setValues: Dispatch<SetStateAction<NasaSearchParams | undefined>>;
}) {
  /**The form's initial HTML is loaded on the server, so we need to wait for react
   * to hydrate the form. Without this the form will be enabled first and user entered data
   * will be lost when react hydrates the form.
   */
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const formProps = useForm<FormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = formProps;

  const onSubmit: SubmitHandler<FormValues> = async (data): Promise<void> => {
    const { keywords, mediaType, yearStart } = data;
    setValues({
      keywords,
      mediaType,
      yearStart: yearStart ? Number(yearStart) : undefined,
      pageSize: 10,
    });
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FieldSet disabled={!isHydrated}>
          <Box marginBottom="m">
            <TextField
              {...register("keywords")}
              errorMessage={errors.keywords?.message}
              label="Keywords"
              required
            />
          </Box>
          <Box marginBottom="m">
            <Select
              {...register("mediaType")}
              errorMessage={errors.mediaType?.message}
              label="Media type"
              required
            >
              <option value="">--Please choose an option--</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </Select>
          </Box>
          <Box marginBottom="m">
            <TextField
              {...register("yearStart")}
              errorMessage={errors.yearStart?.message}
              label="Year start"
            />
          </Box>
        </FieldSet>
        <Box marginBottom="m">
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </>
  );
}
