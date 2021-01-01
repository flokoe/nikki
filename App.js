export default {
  template: `
    <v-app>
      <v-main>
        <router-view></router-view>
      </v-main>

      <v-bottom-navigation v-model="value">
        <v-btn to="profile" value="profile">
          <span>Profile</span>

          <v-icon>mdi-account-circle</v-icon>
        </v-btn>

        <v-btn to="/" value="activity">
          <span>Activity</span>

          <v-icon>mdi-lightning-bolt</v-icon>
        </v-btn>

        <v-btn to="history" value="history">
          <span>History</span>

          <v-icon>mdi-signal</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  `,

  data() {
    return {
      name: 'app',
      value: 'activity'
    }
  }
}
