import { computed } from "vue";
import { useCurrentUser } from "vuefire";

export function useTools() {
    const connectedUser = useCurrentUser()

    const isLoggedIn = computed(() => {
        return connectedUser?.value?.email
    })

    return { isLoggedIn }
}