import { useFormik } from "formik";
import { useCallback, useEffect, useMemo } from "react";
import type { AnyObjectSchema } from "yup";

interface UseCrudFormProps<TFormValues> {
  isEditing: boolean;
  editingItem: Record<string, unknown> | null;
  validationSchema: AnyObjectSchema;
  initialValues: TFormValues;
  fieldMapping: Record<string, string>;
  onSubmit: (values: TFormValues) => Promise<void>;
}

export const useCrudForm = <TFormValues extends Record<string, unknown>>({
  isEditing,
  editingItem,
  validationSchema,
  initialValues,
  fieldMapping,
  onSubmit,
}: UseCrudFormProps<TFormValues>) => {
  const computedInitialValues = useMemo(() => {
    if (isEditing && editingItem) {
      const mapped: Record<string, unknown> = {};
      for (const [formField, modelField] of Object.entries(fieldMapping)) {
        mapped[formField] = editingItem[modelField] ?? initialValues[formField];
      }
      return { ...initialValues, ...mapped } as TFormValues;
    }
    return initialValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, editingItem]);

  const formik = useFormik<TFormValues>({
    initialValues: computedInitialValues,
    validationSchema: validationSchema as never,
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  useEffect(() => {
    if (isEditing && editingItem) {
      const mapped: Record<string, unknown> = {};
      for (const [formField, modelField] of Object.entries(fieldMapping)) {
        mapped[formField] = editingItem[modelField] ?? initialValues[formField];
      }
      formik.setValues({ ...initialValues, ...mapped } as TFormValues);
    } else {
      formik.resetForm({ values: initialValues });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, editingItem]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      formik.submitForm();
    },
    [formik],
  );

  return { formik, handleSubmit };
};
