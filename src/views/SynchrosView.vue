<template>
    <v-container>
        <v-row dense align="center">
            <span class="uni-sans-heavy text-25 grey--text  text--lighten-2 mx-4">{{ lang.synchros }}</span>
        </v-row>

        <v-progress-linear class="my-4" color="grey" :indeterminate="loading"/>

        <v-row align="start" dense>
            <v-col cols="12">
                <v-data-table
                  dark hide-default-footer class="elevation-0 transparent"
                  :headers="headers" :items="synchros.items" disable-sort height="500px"
                >

                    <template v-slot:item.startDate="{ item }">
                        {{ item.startDate.setLocale("es").toFormat('hh:mm a - dd/MM/yy') }}
                    </template>

                    <template v-slot:item.finishDate="{ item }">
                        {{ item.finishDate.setLocale("es").toFormat('hh:mm a - dd/MM/yy') }}
                    </template>

                    <template v-slot:item.createdBy="{ item }">
                        {{ item.createdBy.email }}
                    </template>

                    <template v-slot:item.type="{ item }">
                        {{ item.type }}
                    </template>

                    <template v-slot:item.status="{ item }">
                        {{ item.status }}
                    </template>

                    <template v-slot:item.target="{ item }">
                        <template v-if="item.type == 'TWITTER'">
                            <v-chip color="indigo" @click="$router.push('/profiles/twitter/' + item.twitter.id)">
                                @{{ item.twitter.username }}
                            </v-chip>
                        </template>
                    </template>

                </v-data-table>
            </v-col>
        </v-row>
        <v-row dense justify="end" align="center">
            <v-pagination class="white--text" v-model="page" :length="pageCount" :total-visible="8"/>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import {MultipleItem, SingleItem} from "@/handlers/interfaces/ContentUI"
import CreateUserDialog from "@/components/dialog/CreateUserDialog.vue"
import {Component, Vue, Watch} from "vue-property-decorator"
import SynchroService from "@/service/SynchroService"
import {getModule} from "vuex-module-decorators"
import LangModule from "@/store/LangModule"
import Handler from "@/handlers/Handler"
import Synchro from "@/model/Synchro"

@Component({components: {CreateUserDialog}})
export default class TagView extends Vue {

    lang = getModule(LangModule).lang
    loading: boolean = false
    search: string = ""
    page: number = 1
    size: number = 10
    totalItems: number = 0
    pageCount: number = 0
    synchros: MultipleItem<Synchro> = { items: [], totalItems: 0 }

    headers = [
        { align: 'center', width: 'auto', text: "Fecha de inicio", value: 'startDate' },
        { align: 'center', width: 'auto', text: "Fecha de finalización", value: 'finishDate' },
        { align: 'center', width: 'auto', text: "Creado Por", value: 'createdBy' },
        { align: 'center', width: 'auto', text: "Tipo", value: 'type' },
        { align: 'center', width: 'auto', text: "Estado", value: 'status' },
        { align: 'center', width: 'auto', text: "Objetivo", value: 'target' },
    ]

    created() { this.refresh() }

    async refresh() {
        try {
            await Handler.getItems(this, this.synchros, () =>
              SynchroService.findSynchros(this.page - 1, this.size, this.search, null)
            )
            this.pageCount = Math.ceil(this.synchros.totalItems! / this.size)
        } catch (e) { console.log(e) }
    }

    @Watch('page')
    onPageChanged() { this.refresh() }
}
</script>