<template>
  <v-app :dark="tema === 'dark'">
    <v-app-bar app dense>
      <v-toolbar-title>{{ $t("tituloApp") }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Seletor de idioma com bandeira -->
      <v-select
        v-model="$i18n.locale"
        :items="idiomas"
        item-text="nome"
        item-value="code"
        hide-details
        dense
        solo
        style="max-width: 160px"
      >
        <template v-slot:selection="{ item }">
          <v-avatar left size="20" class="mr-2">
            <img :src="item.bandeira" alt="bandeira" />
          </v-avatar>
          {{ item.nome }}
        </template>

        <template v-slot:item="{ item }">
          <v-list-item-content class="d-flex align-center">
            <v-avatar left size="20" class="mr-2">
              <img :src="item.bandeira" alt="bandeira" />
            </v-avatar>
            <v-list-item-title>{{ item.nome }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-select>

      <!-- Seletor de tema traduzido -->
      <v-select
        :items="temasTraduzidos"
        item-text="label"
        item-value="value"
        :label="$t('tema')"
        v-model="tema"
        hide-details
        dense
        solo
        style="max-width: 120px; margin-left: 10px"
      />
    </v-app-bar>

    <v-main>
      <curriculo-inteligente />
    </v-main>
  </v-app>
</template>

<script>
import CurriculoInteligente from "./components/CurriculoInteligente.vue";

export default {
  components: {
    CurriculoInteligente,
  },
  data() {
    return {
      tema:
        localStorage.getItem("temaSelecionado") ||
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"),
      idiomas: [
        {
          nome: "Português",
          code: "pt-BR",
          bandeira:
            "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg",
        },
        {
          nome: "English",
          code: "en-US",
          bandeira:
            "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
        },
        {
          nome: "Español",
          code: "es-ES",
          bandeira:
            "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg",
        },
      ],
    };
  },
  computed: {
    temasTraduzidos() {
      return [
        { value: "light", label: this.$t("light") },
        { value: "dark", label: this.$t("dark") },
      ];
    },
  },
  watch: {
    tema(val) {
      this.$vuetify.theme.dark = val === "dark";
      localStorage.setItem("temaSelecionado", val);
    },
    "$i18n.locale"(novoIdioma) {
      localStorage.setItem("idiomaSelecionado", novoIdioma);
    },
  },
  created() {
    const idiomaSalvo = localStorage.getItem("idiomaSelecionado");
    if (idiomaSalvo) {
      this.$i18n.locale = idiomaSalvo;
    }
    this.$vuetify.theme.dark = this.tema === "dark";

    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          // Só muda o tema se o usuário não tiver salvo preferência
          if (!localStorage.getItem("temaSelecionado")) {
            this.tema = e.matches ? "dark" : "light";
          }
        });
    }
  },
};
</script>

<style>
.v-avatar img {
  object-fit: contain;
  max-width: 100%;
  height: auto;
}
</style>
