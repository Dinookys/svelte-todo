// since there's no dynamic data here, we can prerender

import { todoStore } from "$lib/components/Todo/TodoStore";
import { onMount } from "svelte";

// it so that it gets served as a static asset in production
export const prerender = true;

export const load = () => {

    function loadDataFromLocalStorage() {
        if (localStorage?.todoStore) {
            console.log("load local")
            todoStore.set(JSON.parse(localStorage.todoStore));
        }

        todoStore.subscribe((state) => {
            console.log("update local")
            localStorage.setItem("todoStore", JSON.stringify(state));
        })
    }

    return {
        loadDataFromLocalStorage
    }
}