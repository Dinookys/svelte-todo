import { createEventDispatcher } from "svelte";


export function dragItem(node: HTMLElement) {
    const dispatch = createEventDispatcher();

    node.setAttribute("draggable", "true");


    const dragStart = (event: DragEvent) => {
        node.classList.add("dragitem");
        node.classList.add("dragged");
        dispatch("dragstart", event);
    };

    const dragEnd = (event: DragEvent) => {
        node.classList.remove("dragged");        
        dispatch("dragend", event);
        document.getElementById('drag-item')?.remove();
    };

    const dragLeave = (event: DragEvent) => {        ;
        node.classList.remove("dragenter");
        dispatch("dragleave", event);
    };

    const dragOver = (event: DragEvent) => {
        node.classList.add("dragitem");
        node.classList.add("dragenter");
        dispatch("dragover", event);
    };

    node.addEventListener("dragstart", dragStart);
    node.addEventListener("dragend", dragEnd);
    node.addEventListener("dragleave", dragLeave);
    node.addEventListener("dragover", dragOver);

    return {
        destroy() {
            node.removeEventListener("dragstart", dragStart);
            node.removeEventListener("dragend", dragEnd);
            node.removeEventListener("dragleave", dragLeave);
            node.removeEventListener("dragover", dragOver);
        }
    }
}

export function dropZone(node: HTMLElement) {
    const dispatch = createEventDispatcher();
    const dropEvent = (event: DragEvent) => {
        node.querySelectorAll(".dragenter").forEach((el) => {
            el.classList.remove("dragenter");
        });
        dispatch("drop", event);
    };

    const dragover = (event: DragEvent) => {
        event.preventDefault();
        return false;
    }

    node.addEventListener("drop", dropEvent);
    node.addEventListener("dragover", dragover);

    return {
        destroy() {
            node.removeEventListener("drop", dropEvent);
            node.removeEventListener("dragover", dragover);
        },
    };
}