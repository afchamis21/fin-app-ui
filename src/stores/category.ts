import { createCategory } from "@/api/category/create-category";
import { deleteCategory } from "@/api/category/delete-category";
import { getCategories } from "@/api/category/get-categories";
import { updateCategory } from "@/api/category/update-category";
import { updateCategoryStatus } from "@/api/category/update-category-status";
import type { ICreateCategoryRequest } from "@/types/http/Category";
import type { ICategory } from "@/types/ICategory";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { useAuthStore } from "./auth";

export const useCategoryStore = defineStore('category', () => {
  const authStore = useAuthStore()
  const categories = ref([] as ICategory[])
  const isLoadingCategories = ref(false)

  const invalidate = () => {
    categories.value = []
  }

  watch(() => authStore.user, (val) => {
    if (!val) {
      invalidate()
    }
  })

  const activeCategories = computed(() => categories.value.filter(cat => cat.active))

  const fetchCategories = async () => {
    try {
      isLoadingCategories.value = true
      const { data } = await getCategories()
      categories.value = data.payload.sort((a, b) => a.label.localeCompare(b.label))
    } catch {
      toast.warning("Erro buscando categorias")
    } finally {
      isLoadingCategories.value = false
    }
  }

  const addCategory = async (req: ICreateCategoryRequest) => {
    try {
      const { data } = await createCategory(req);
      categories.value.push(data.payload);
      toast.success("Categoria adicionada com sucesso!");
    } catch {
      toast.error("Erro salvando categoria");
    }
  };

  const editCategory = async (req: ICategory) => {
    try {
      const { data } = await updateCategory(req.id, { ...req });
      categories.value = categories.value.map(cat => {
        if (cat.id === data.payload.id) {
          return data.payload;
        }
        return cat;
      });
      toast.success("Categoria editada com sucesso!");
    } catch {
      toast.error("Erro salvando categoria");
    }
  };

  const removeCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      categories.value = categories.value.filter(category => category.id !== id);
      toast.success("Categoria removida com sucesso!");
    } catch {
      toast.error("Erro deletando categoria");
    }
  };

  const activate = async (id: number) => {
    try {
      await updateCategoryStatus(id, true)
      categories.value = categories.value.map(cat => {
        if (cat.id === id) {
          return {
            ...cat,
            active: true
          };
        }

        return cat;
      });
      toast.success("Categoria ativada com sucesso!");
    } catch {
      toast.error("Erro ativando categoria");
    }
  }


  const deactivate = async (id: number) => {
    try {
      await updateCategoryStatus(id, false)
      categories.value = categories.value.map(cat => {
        if (cat.id === id) {
          return {
            ...cat,
            active: false
          };
        }

        return cat;
      });
      toast.success("Categoria arquivada com sucesso!");
    } catch {
      toast.error("Erro arquivando categoria");
    }
  }

  return { categories, addCategory, editCategory, removeCategory, fetchCategories, isLoadingCategories, activeCategories, activate, deactivate }
})
