export default function (node: HTMLTextAreaElement) {

    const onInputTextArea = () => {
        node.rows = node.value.split("\n").length + 1
    }

    $: onInputTextArea();
    node.addEventListener("input", onInputTextArea);

    return {
        destroy() {
            node.removeEventListener("input", onInputTextArea);
        }
    }
}