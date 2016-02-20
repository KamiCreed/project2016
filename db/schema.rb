# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160219072030) do

  create_table "players", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "health",                   default: 50
    t.integer  "strength",                 default: 10
    t.integer  "defense",                  default: 10
    t.integer  "level",                    default: 1
    t.integer  "experience",               default: 0
    t.integer  "gold",                     default: 0
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.integer  "max_health",               default: 50
    t.integer  "experience_to_next_level", default: 10
  end

  add_index "players", ["user_id"], name: "index_players_on_user_id"

  create_table "users", force: :cascade do |t|
    t.string   "username"
    t.string   "email"
    t.string   "password_digest"
    t.boolean  "admin",           default: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "remember_digest"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["username"], name: "index_users_on_username", unique: true

end