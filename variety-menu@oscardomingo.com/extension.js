/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/* exported init enable disable */

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const GLib = imports.gi.GLib;
const Util = imports.misc.util;


var PlaceMenuItem = GObject.registerClass(
class PlaceMenuItem extends PopupMenu.PopupBaseMenuItem {
    _init(info) {
        super._init();
        this._info = info;

        this._icon = new St.Icon({
            gicon: info.icon,
            icon_size: 16,
        });
        this.add_child(this._icon);

        this._label = new St.Label({ text: info.name, x_expand: true });
        this.add_child(this._label);

        this._changedId = info.connect('changed',
            this._propertiesChanged.bind(this));
    }

    destroy() {
        if (this._changedId) {
            this._info.disconnect(this._changedId);
            this._changedId = 0;
        }

        super.destroy();
    }

    activate(event) {
        this._info.launch(event.get_time());

        super.activate(event);
    }

    _propertiesChanged(info) {
        this._icon.gicon = info.icon;
        this._label.text = info.name;
    }
});


let VarietyMenu = GObject.registerClass(
class VarietyMenu extends PanelMenu.Button{
    _init() {
        super._init(0.0);

        let hbox = new St.BoxLayout();

        let icon = new St.Icon({ icon_name: 'variety-indicator',
           style_class: 'system-status-icon' });

        hbox.add_child(icon);
        this.add_actor(hbox);

        //Pause
        let playback_pause = new PopupMenu.PopupImageMenuItem('Pause', 'media-playback-pause-symbolic');
        playback_pause.connect('activate',  ()=>{
            Util.spawn(['variety', '--pause']);
        });
        this.menu.addMenuItem(playback_pause);

        //next
        let playback_resume = new PopupMenu.PopupImageMenuItem('Resume', 'media-playback-start-symbolic');
        playback_resume.connect('activate',  ()=>{
            Util.spawn(['variety', '--resume']);
        });
        this.menu.addMenuItem(playback_resume);

        //next
        let playback_next = new PopupMenu.PopupImageMenuItem('Next', 'go-next-symbolic');
        playback_next.connect('activate',  ()=>{
            Util.spawn(['variety', '--next']);
        });
        this.menu.addMenuItem(playback_next);
        //prev
        let playback_previous = new PopupMenu.PopupImageMenuItem('Previous', 'go-previous-symbolic');
        playback_previous.connect('activate',  ()=>{
            Util.spawn(['variety', '--previous']);
        });
        this.menu.addMenuItem(playback_previous);
        
        let show_image = new PopupMenu.PopupImageMenuItem('Open Image', 'open-menu-symbolic');
        this.menu.addMenuItem(show_image);

        // View at source (needs CLI option for this).
        // let show_source = new PopupMenu.PopupImageMenuItem('View at source', 'link-symbolic');
        // show_source.connect('activate',  ()=>{
        //     Util.spawn(['variety', '--pause']);
        // });
        // this.menu.addMenuItem(show_source);

        // Copy the current Wallpaper to the favourites folder.
        let copy_to_favourites = new PopupMenu.PopupImageMenuItem('Copy to Favourites', 'starred-symbolic');
        copy_to_favourites.connect('activate',  ()=>{
            Util.spawn(['variety', '--favorite']);
        });
        this.menu.addMenuItem(copy_to_favourites);

        // Delete (and blacklist) the current Wallpaper.
        let delete_to_trash = new PopupMenu.PopupImageMenuItem('Delete to Trash', 'edit-delete-symbolic');
        delete_to_trash.connect('activate',  ()=>{
            Util.spawn(['variety', '--trash']);
        });
        this.menu.addMenuItem(delete_to_trash);


        // Separator 
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Toggle history
        let show_history = new PopupMenu.PopupMenuItem('Toggle History display');
        show_history.connect('activate',  ()=>{
            Util.spawn(['variety', '--history']);
        });
        this.menu.addMenuItem(show_history);

        // Toggle Wallpaper selection display
        let wallpaper_selector = new PopupMenu.PopupMenuItem('Toggle Wallpaper Selector display.');
        wallpaper_selector.connect('activate',  ()=>{
            Util.spawn(['variety', '--selector']);
        });
        this.menu.addMenuItem(wallpaper_selector);

        // Toggle Recent Downloads Display
        let recent_downloads = new PopupMenu.PopupMenuItem('Toggle Recent Downloads display.');
        recent_downloads.connect('activate',  ()=>{
            Util.spawn(['variety', '--downloads']);
        });
        this.menu.addMenuItem(recent_downloads);

        // Preferences
        let preferences = new PopupMenu.PopupMenuItem('Preferences...');
        preferences.connect('activate',  ()=>{
            Util.spawn(['variety', '--preferences']);
        });
        this.menu.addMenuItem(preferences);

        // About
        let about = new PopupMenu.PopupMenuItem('About...');
        about.connect('activate',  ()=>{
            Util.spawn(['gio', 'open', 'https://peterlevi.com/variety/']);
        });
        this.menu.addMenuItem(about);

        // Donate
        let donate = new PopupMenu.PopupMenuItem('Donate...');
        donate.connect('activate',  ()=>{
            Util.spawn(['gio', 'open', 'https://peterlevi.com/variety/donate/']);
        });
        this.menu.addMenuItem(donate);
        //Quit
        let quit = new PopupMenu.PopupMenuItem('Quit');
        quit.connect('activate',  ()=>{
            Util.spawn(['variety', '--quit']);
        });
        this.menu.addMenuItem(quit);


        this.menu.connect('open-state-changed', ()=>{
            if(this.menu.isOpen) {
                this._update_wallpaper_path();
            };

        });

    }

    _update_wallpaper_path() {
        if (this._open_image_action_id) {
            this.menu.box.get_children()[4].disconnect(this._open_image_action_id);    
        }

        let wp_path = ''
        let [get_wp_success, get_wp_stdout, get_wp_stderr, get_wp_exit_status] = GLib.spawn_command_line_sync('variety --get');

        wp_path = imports.byteArray.toString(get_wp_stdout).replace("Variety is already running. Sending the command to the running instance.", "");
        wp_path = wp_path.trim();

        this._open_image_action_id = this.menu.box.get_children()[4].connect('activate',  ()=>{
            Util.spawn(['gio', 'open', wp_path]);
        });
    }

    _onDestroy() {
        super._onDestroy();
    }

});


function init() {
    //ExtensionUtils.initTranslations();
}

let _indicator;

function enable() {
    _indicator = new VarietyMenu();
    Main.panel.addToStatusArea('places-menu', _indicator, 0, 'right');
}

function disable() {
    _indicator.destroy();
}
