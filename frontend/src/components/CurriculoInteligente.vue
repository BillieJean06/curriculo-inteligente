<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <!-- Cartão com dados fixos -->
        <v-card class="pa-4" outlined>
          <v-avatar size="120" class="mx-auto mb-4">
            <img :src="fotoPerfil" alt="Foto de Perfil" />
          </v-avatar>

          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ $t("nome") }}:
                </v-list-item-title>
                <v-list-item-subtitle>{{ nome }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ $t("email") }}:
                </v-list-item-title>
                <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ $t("telefone") }}:
                </v-list-item-title>
                <v-list-item-subtitle>{{ telefone }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ $t("descricao") }}:
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  descricaoPerfil
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ $t("disponivelParaTrabalho") }}:
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon :color="disponibilidade ? 'green' : 'red'">
                    {{
                      disponibilidade ? "mdi-check-circle" : "mdi-close-circle"
                    }}
                  </v-icon>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <vue-qrcode :value="linkCurriculo" :size="128" class="mt-4" />

        <v-btn class="mt-4 no-print" color="secondary" @click="gerarPDF">
          <v-icon left>mdi-download</v-icon>
          {{ $t("baixarCurriculo") }}
        </v-btn>

        <v-btn
          class="mt-2 no-print"
          color="primary"
          @click="ativarMiniCurriculo"
        >
          <v-icon left>mdi-printer</v-icon>
          {{ $t("versaoImpressao") }}
        </v-btn>
      </v-col>

      <v-col cols="12" md="8">
        <v-select
          :items="areas"
          v-model="filtro"
          :label="$t('filtroArea')"
          clearable
          dense
          outlined
          class="mb-4"
        />

        <v-expansion-panels multiple>
          <v-expansion-panel v-for="(exp, i) in experienciasFiltradas" :key="i">
            <v-expansion-panel-header>
              {{ exp.cargo }} - {{ exp.empresa }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                <strong>{{ $t("periodo") }}:</strong> {{ exp.periodo }}
              </p>
              <p>{{ exp.descricao }}</p>
              <v-chip-group column>
                <v-tooltip
                  v-for="(skill, j) in exp.habilidades"
                  :key="j"
                  bottom
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      v-on="on"
                      small
                      class="ma-1"
                      color="primary"
                      dark
                    >
                      {{ skill }}
                    </v-chip>
                  </template>
                  <span>{{ getTooltip(skill) }}</span>
                </v-tooltip>
              </v-chip-group>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-card class="mt-6 pa-4" outlined>
          <v-card-title>{{ $t("habilidades") }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" v-for="(skill, i) in skills" :key="i">
                <div class="d-flex justify-space-between">
                  <strong>{{ skill.nome }}</strong>
                  <span>{{ skill.nivel }}%</span>
                </div>
                <v-progress-linear
                  :value="skill.nivel"
                  color="primary"
                  height="10"
                  rounded
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- NOVO BLOCO DE TECNOLOGIAS DO GITHUB -->
        <v-card class="mt-6 pa-4" outlined>
          <v-card-title>{{ $t("tecnologiasGitHub") }}</v-card-title>
          <v-card-text>
            <div class="d-flex align-center">
              <div
                v-for="(tech, index) in skillsGithub"
                :key="index"
                :style="{
                  width: tech.nivel + '%',
                  backgroundColor: tech.color,
                  height: '24px',
                  borderTopLeftRadius: index === 0 ? '5px' : '0',
                  borderBottomLeftRadius: index === 0 ? '5px' : '0',
                  borderTopRightRadius:
                    index === skillsGithub.length - 1 ? '5px' : '0',
                  borderBottomRightRadius:
                    index === skillsGithub.length - 1 ? '5px' : '0',
                }"
                :title="tech.nome + ' - ' + tech.nivel + '%'"
              ></div>
            </div>
            <div class="d-flex flex-wrap mt-2">
              <v-chip
                v-for="(tech, i) in skillsGithub"
                :key="'chip-' + i"
                class="ma-1"
                small
                :color="tech.color"
                dark
              >
                {{ tech.nome }} - {{ tech.nivel }}%
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mt-6 pa-4" outlined>
          <v-card-title>{{ $t("projetos") }}</v-card-title>
          <v-list dense>
            <v-list-item
              v-for="repo in repos"
              :key="repo.id"
              :href="repo.html_url"
              target="_blank"
            >
              <v-list-item-content>
                <v-list-item-title>{{ repo.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ repo.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip small color="primary" v-if="repo.language">
                  {{ repo.language }}
                </v-chip>
                <v-icon small class="ml-2" color="yellow darken-3"
                  >mdi-star</v-icon
                >
                <span>{{ repo.stargazers_count }}</span>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="repos.length === 0">
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t("semRepositorios") }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="mt-6 pa-4" outlined>
          <v-card-title>{{ $t("contato") }}</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="formValido" lazy-validation>
              <v-text-field
                :label="$t('nome')"
                v-model="formData.from_name"
                :rules="[(v) => !!v || $t('campoObrigatorio')]"
                required
              />
              <v-text-field
                :label="$t('email')"
                v-model="formData.reply_to"
                :rules="[
                  (v) => !!v || $t('campoObrigatorio'),
                  (v) => /.+@.+\\..+/.test(v) || $t('emailInvalido'),
                ]"
                required
              />
              <v-textarea
                :label="$t('mensagem')"
                v-model="formData.message"
                :rules="[(v) => !!v || $t('campoObrigatorio')]"
                required
              />
              <v-btn
                :disabled="!formValido || carregando"
                color="primary"
                @click="enviarEmail"
              >
                <v-icon left>mdi-send</v-icon>
                {{ carregando ? $t("enviando") : $t("enviar") }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import VueQrcode from "vue-qrcode-component";

export default {
  components: {
    VueQrcode,
  },
  data() {
    return {
      nome: "Isaque Teodoro",
      email: "isaque.teodoro1234@gmail.com",
      telefone: "(19) 99305-0163",
      fotoPerfil: require("@/assets/foto.jpg"),
      disponibilidade: false,
      filtro: null,
      formValido: false,
      carregando: false,
      formData: {
        from_name: "",
        reply_to: "",
        message: "",
      },
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
      skills: [
        { nome: "JavaScript", nivel: 70 },
        { nome: "Vue", nivel: 79 },
        { nome: "Node.js", nivel: 60 },
        { nome: "Git", nivel: 75 },
        { nome: "CSS", nivel: 70 },
        { nome: "HTML", nivel: 70 },
        { nome: "Python", nivel: 70 },
        { nome: "Ubuntu", nivel: 75 },
      ],
      skillsGithub: [
        { nome: "Vue", nivel: 64.13, color: "#41B883" },
        { nome: "JavaScript", nivel: 19.84, color: "#f1e05a" },
        { nome: "Python", nivel: 13.32, color: "#1a54d9" },
        { nome: "HTML", nivel: 2.54, color: "#e34c26" },
        { nome: "CSS", nivel: 0.16, color: "#563d7c" },
      ],
      repos: [],
      linkCurriculo: "https://example.com/curriculo.pdf",
    };
  },
  computed: {
    descricaoPerfil() {
      return this.$t("descricao1");
    },
    experiencias() {
      return this.$t("experiencias");
    },
    areas() {
      const todas = this.experiencias.map((e) => e.area);
      return [...new Set(todas)];
    },
    experienciasFiltradas() {
      if (!this.filtro) return this.experiencias;
      return this.experiencias.filter((e) => e.area === this.filtro);
    },
  },
  methods: {
    getTooltip(skill) {
      const tooltips = {
        "Vue.js": "Framework JavaScript progressivo para interfaces de usuário",
        JavaScript: "Linguagem de programação da web",
        "Node.js": "Ambiente de execução JavaScript no servidor",
        MongoDB: "Banco de dados NoSQL orientado a documentos",
        Git: "Sistema de controle de versões",
        Docker: "Plataforma para containers",
      };
      return tooltips[skill] || "";
    },
    enviarEmail() {
      if (!this.$refs.form.validate()) return;

      this.carregando = true;

      setTimeout(() => {
        this.carregando = false;
        this.snackbar.text = this.$t("sucesso");
        this.snackbar.color = "green";
        this.snackbar.show = true;

        this.formData.from_name = "";
        this.formData.reply_to = "";
        this.formData.message = "";
        this.$refs.form.resetValidation();
      }, 2000);
    },
    gerarPDF() {
      window.print();
    },
    ativarMiniCurriculo() {
      window.print();
    },
    async fetchRepos() {
      const username = "NeegoVeio";
      const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar repositórios");
        }
        const data = await response.json();
        this.repos = data;
      } catch (error) {
        this.snackbar.text = "Erro ao carregar projetos do GitHub.";
        this.snackbar.color = "red";
        this.snackbar.show = true;
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchRepos();
  },
};
</script>

<style scoped>
.no-print {
  @media print {
    display: none !important;
  }
}
</style>
