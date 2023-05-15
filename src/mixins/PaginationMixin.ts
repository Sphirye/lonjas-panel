import { Component, Vue, Watch } from "vue-property-decorator"

@Component
export default class PaginationMixin extends Vue {

    page: number = 1
    search: string = ""
    size: number = 20
    pageCount: number = 0

    // Should be called after items refresh.
    setPageCount(totalItems: number) { this.pageCount = Math.ceil(totalItems / this.size) }

    resetAll() {
        this.page = 1
        this.search = ""
    }

}