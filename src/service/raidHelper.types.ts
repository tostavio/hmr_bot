export interface SignUp {
  entryTime: number;
  specName: string;
  name: string;
  className: string;
  specEmoteId: string;
  id: number;
  position: number;
  classEmoteId: string;
  userId: string;
  status: string;
}

export interface Spec {
  name: string;
  roleName: string;
  emoteId: string;
}

export interface Class {
  specs: Spec[];
  name: string;
  limit: number;
  emoteId: string;
  type: string;
}

export interface AdvancedSettings {
  temp_voicechannel: string;
  limit_per_user: number;
  date1_emote: string;
  tentative_emote: string;
  apply_unregister: boolean;
  show_content: boolean;
  countdown2_emote: string;
  event_type: string;
  deletion: string;
  limit: number;
  mention_mode: boolean;
  signups1_emote: string;
  bench_overflow: boolean;
  show_emotes: boolean;
  banned_roles: string;
  image: string;
  thumbnail: string;
  show_footer: boolean;
  apply_specreset: boolean;
  disable_reason: boolean;
  allow_duplicate: boolean;
  forum_tags: string;
  show_classes: boolean;
  alt_names: boolean;
  time2_emote: string;
  preserve_order: string;
  force_reminders: string;
  show_title: boolean;
  leader_emote: string;
  mentions: string;
  show_info: boolean;
  late_emote: string;
  create_discordevent: boolean;
  show_counter: boolean;
  show_banned: boolean;
  bench_emote: string;
  lower_limit: number;
  opt_out: string;
  color: string;
  use_nicknames: boolean;
  info_variant: string;
  show_on_overview: boolean;
  voice_channel: string;
  duration: number;
  pin_message: boolean;
  create_thread: string;
  spec_saving: boolean;
  vacuum: boolean;
  time1_emote: string;
  defaults_pre_req: boolean;
  deadline: string;
  horizontal_mode: boolean;
  show_countdown: boolean;
  date2_emote: string;
  reminder: string;
  mention_leader: boolean;
  bold_all: boolean;
  show_leader: boolean;
  font_style: string;
  signups2_emote: string;
  temp_role: string;
  allowed_roles: string;
  queue_bench: boolean;
  show_roles: boolean;
  date_variant: string;
  response: string;
  lock_at_limit: boolean;
  disable_archiving: boolean;
  countdown1_emote: string;
  absence_emote: string;
  show_numbering: boolean;
  show_allowed: boolean;
  delete_thread: boolean;
  attendance: string;
}

export interface Announcement {
  channel: string;
  time: string;
  message: string;
}

export interface EventResponse {
  date: string;
  signUps: SignUp[];
  color: string;
  classes: Class[];
  roles: string[];
  description: string;
  channelType: string;
  title: string;
  templateId: string;
  serverId: string;
  leaderId: string;
  lastUpdated: number;
  displayTitle: string;
  closingTime: number;
  leaderName: string;
  advancedSettings: AdvancedSettings;
  startTime: number;
  temporaryRole: string;
  channelName: string;
  id: string;
  time: string;
  endTime: number;
  channelId: string;
  announcement?: Announcement;
}

export interface Dkp {
  name: string;
  dkp: string; // Keeping this as string as per the provided JSON
  id: string;
}

export interface DkpResponse {
  result: Dkp[];
}
