imports.gi.versions.St = "1.0";

const St = imports.gi.St;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;

class VarietyMenu extends PanelMenu.Button{
    constructor(){
        super(St.Align.START);

        let box = new St.BoxLayout();

        let icon = new St.Icon({ icon_name: 'variety-indicator',
           style_class: 'system-status-icon' });
        box.add(icon);

        this.actor.add_child(box);

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

        //image-viewer
        // let show_image = new PopupMenu.PopupImageMenuItem('View Image', 'open-menu-symbolic');
        // show_image.connect('activate',  ()=>{
        //     Util.spawn(['variety', '--pause']);
        // });
        // this.menu.addMenuItem(show_image);

        //view at source
        // let show_source = new PopupMenu.PopupImageMenuItem('View at source', 'link-symbolic');
        // show_source.connect('activate',  ()=>{
        //     Util.spawn(['variety', '--pause']);
        // });
        // this.menu.addMenuItem(show_source);

        //copy to fav
        let copy_to_favourites = new PopupMenu.PopupImageMenuItem('Copy to Favourites', 'starred-symbolic');
        copy_to_favourites.connect('activate',  ()=>{
            Util.spawn(['variety', '--favorite']);
        });
        this.menu.addMenuItem(copy_to_favourites);
        // delete to trash
        let delete_to_trash = new PopupMenu.PopupImageMenuItem('Delete to Trash', 'edit-delete-symbolic');
        delete_to_trash.connect('activate',  ()=>{
            Util.spawn(['variety', '--trash']);
        });
        this.menu.addMenuItem(delete_to_trash);
        // image submenu

        // Separator 
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Toggle history
        let show_history = new PopupMenu.PopupMenuItem('History');
        show_history.connect('activate',  ()=>{
            Util.spawn(['variety', '--history']);
        });
        this.menu.addMenuItem(show_history);

        // Wallpaper selection
        let wallpaper_selector = new PopupMenu.PopupMenuItem('Wallpaper Selector');
        wallpaper_selector.connect('activate',  ()=>{
            Util.spawn(['variety', '--selector']);
        });
        this.menu.addMenuItem(wallpaper_selector);
        // Recent Downloads
        // let recent_downloads = new PopupMenu.PopupMenuItem('Recent Downloads');
        // recent_downloads.connect('activate',  ()=>{
        //     Util.spawn(['variety', '--downloads']);
        // });
        // this.menu.addMenuItem(recent_downloads);
        // Preferences
        let preferences = new PopupMenu.PopupMenuItem('Preferences...');
        preferences.connect('activate',  ()=>{
            Util.spawn(['variety', '--preferences']);
        });
        this.menu.addMenuItem(preferences);
        // About
        // let about = new PopupMenu.PopupMenuItem('About...');
        // about.connect('activate',  ()=>{
        //     Util.spawn(['variety', '--pause']);
        // });
        // this.menu.addMenuItem(about);
        // Donate
        let donate = new PopupMenu.PopupMenuItem('Donate...');
        donate.connect('activate',  ()=>{
            Util.spawn(['xdg-open', 'https://peterlevi.com/variety/donate/']);
        });
        this.menu.addMenuItem(donate);
        //Quit
        let quit = new PopupMenu.PopupMenuItem('Quit');
        quit.connect('activate',  ()=>{
            Util.spawn(['variety', '--quit']);
        });
        this.menu.addMenuItem(quit);



    }
}

let varietyMenu;

function init(){
}

function enable(){
    varietyMenu = new VarietyMenu();
    Main.panel.addToStatusArea('VarietyMenu', varietyMenu, 0, 'right');
}

function disable() {
    varietyMenu();
}