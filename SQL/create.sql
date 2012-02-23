CREATE DATABASE lohereplus;
USE lohereplus;
#kommentek a táblakreálások alatt fognak szerepelni, és a komment feletti táblára vonatkoznak -zorg
# /* */ közt lehet (nem ;-al lezárt) sorok mögé is, de ott inkább az egyező típusokat jelölöm, konzisztencia miatt.

CREATE TABLE user_table(
    uid INTEGER NOT NULL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(32) NOT NULL,
    userlevel INTEGER NOT NULL,
    regdate DATETIME NOT NULL,
    lastdate DATETIME NOT NULL,
    dispNameType SMALLINT NOT NULL,
);

# uid: a felhasználó egyedi id-je
# username: egyedi felhasználó név (bár elvben a jelszóhash mentén lehetne nem-egyedi username uid miatt)
# password: az elküldött md5 hash az oldal saltjával való újramd5-ölt hashe lementve; magyarul a jelszó
# userlevel: 0 - user banned, 1 - regular user, 2 - priviliged user, 3 - mod, 4 - admin (2 azért mert jól jöhet még)
# regdate: regisztrálási dátum
# lastdate: utoljára belépett ekkor (kérdéses a kellete)
# DEPRECATED: regIPh: a regisztrációnál használt ip hash-e, ha a hash kötött karakterhosszúságú, akkor legyen CHAR(n).
# MERGED: isAnon és isAnon2 -> dispNameType
# dispNameType: 0 - anonymous (board specific), 1 - ipéc imre (semi-board specific), 2 - username
# DEPRECATED: isBanned bool eltüntetve mert nem támogat per-board ban-t.
# DEPRECATED: isLazyload BOOL NOT NULL: wakarimasen lol | felesleges, ez a default, akik akarják hogy a böngészőjük meghaljon azok noscriptezhetnek.
# DEPRECATED: isHTMLview BOOL NOT NULL: compatibility view, csak html render, ami lementhető inverz-kamionokkal | comp.magyarchan.net, meg esetleg sütiben
# DEPRECATED: cssSkin VARCHAR(32) NOT NULL DEFAULT 'lohere': default skin, board specifikusak force-felülírják. | megy php sütibe hogy nem-regelteknek is legyen lehetőségük.

CREATE TABLE ip_table(
    ip VARCHAR(39) NOT NULL PRIMARY KEY,                                                              
);

# ip: egy ip cím -> mergelve sessionid táblába vagy nem

CREATE TABLE sessid(
	ssid INTEGER NOT NULL UNIQUE
	sshash INTEGER NOT NULL
	
);

# majd később

CREATE TABLE board_table(
    bid INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(16) NOT NULL UNIQUE,
    descr VARCHAR(64),
    cssSkin VARCHAR(32) NOT NULL DEFAULT 'lohere',
    cssOverride BOOL NOT NULL,
    isHidden BOOL NOT NULL,
    isLocked BOOL NOT NULL,
    isSecured BOOL NOT NULL,
    isRedirected BOOL NULL,
    isNSFW BOOL NOT NULL DEFAULT TRUE,
    maxthreadnumber INTEGER NOT NULL,
    threadsperpage INTEGER NOT NULL,
    postdelaysecs INTEGER,
    currlocalpid INTEGER NOT NULL,
    currlocaltid INTEGER NOT NULL,
);

# bid: board id-je, 0 = "minden board" defaultok
# name: a tábla / / közötti neve, egy vagy több karakter
# descr: a tábla hosszabb neve
# cssSkin: a tábla skine
# cssOverride: ha igaz, akkor bármilyen skint állítasz be magadnak, a board skinje felülírja
# isHidden: a board nem látszik a listában
# isLocked: nem töltődik be a posztbox, és a posztolás sem engedélyezett (hátha valaki olyan buddhista haxxor hogy tudna küldeni egy poszt()-ot legit adatokkal a szervernek)
# isSecured: bármely más boardról a secured boardokra mutató linkek egy belső 404 oldalra visznek
# isRedirected: a board nem töltődik be se linkkel se direkt címsávba írással, blank page-t kap mindenki (vagy esetleg pvrvtty^r^ át lehet irányítani)
# isNSFW: ha igaz, akkor a táblán előfordulhatnak spoiler nélküli pucér kínai rajzfilm-kisfiúk
# maxthreadnumber: az egész boardon egy adott pillanatban rajta lévő thredek felső határértéke
# threadsperpage: egy oldalon megjeleníthető threadek felső korlátja (egy új board-oldal nyitásához az elsőnek el kell érnie ezt az értéket)
# a fenti kettőből ki lehet számolni, hogy egy adott boardon hány oldalnyi thread van.
# postdelaysecs: egy sessionből posztolásnál két poszt között eltöltődő minimum idő.
# currlocalpid: posztok törlésével ugye a pid-ek is vesződnek, namost mégha az sql nem is írja felül az eredetit, azért nem ártana egy változóban vezetni, hogy melyik a legújabb poszt a boardon.
# currlocaltid: ugyanaz a helyzet itt mint a pid-nél.
# DEPRECATED: primaryboardifalias INTEGER: ha ez egy alias, akkor a "fő" boardra mutat. ha így van megcsinálva, akkor fasszopás. inkább cfg vagy php.

CREATE TABLE filetype_table(
    fid INTEGER NOT NULL PRIMARY KEY,
    ext VARCHAR(8) NOT NULL,
    mime VARCHAR(48),
    magic BLOB, /* nincs clob mysqlben :C */
    icon VARCHAR(32)
);

# fid: fájltípus id-je
# ext: kiterjesztés
# mime: pantomim
# magic: nem biztos hogy kell
# icon:-hoz nem teszünk not null feltételt.

CREATE TABLE ftypeboardlink_table(
    bid INTEGER NOT NULL REFERENCES board.bid
        ON UPDATE CASCADE                     /* nem fordulhat elő */
        ON DELETE CASCADE,                    /* board törölve -> board specifikus fájltípusok törölve */
    fid INTEGER NOT NULL REFERENCES filetype.fid
        ON UPDATE CASCADE                     /* nem fordulhat elő */
        ON DELETE CASCADE,                    /* fájltípus törölve -> boardonként törölve ez mint megengedett fájltípus*/
    maxfilesize INTEGER DEFAULT 5242880,
    PRIMARY KEY(bid,fid)
);

# kapcsolótábla: boardtípusonként milyen fájltípusok engedettek meg.
# maxfilesize: egyértelmű kapitány

CREATE TABLE thread_table(
    tid INTEGER NOT NULL PRIMARY KEY,
	bid INTEGER NOT NULL REFERENCES board.bid
        ON UPDATE CASCADE                     /* nem fordulhat elő */
        ON DELETE CASCADE                     /* board törölve -> threadek törölve */
    isDeleted BOOL NOT NULL,
    isLocked BOOL NOT NULL,
    isSticky BOOL NOT NULL,
    isDroppedoff BOOL NOT NULL,
    purgbumpsreceived INTEGER,
    lastpostdate DATETIME NOT NULL,
    currlocalpid INTEGER DEFAULT 0,
);

# tid: thread id-je.
# bid: külső kulcs, jelenti hogy ez a thred melyik boardon van
# isDeleted: igaz -> a thread nem jelenítődik meg, és majd éjfélkor törlődik
# isLocked: igaz -> a threadbe nem lehet posztolni
# isSticky: igaz -> felülmarad a thread
# isDroppedOff: igaz -> a thread átkerül purgatóriumba
# purgbumpsreceived: ha purgatóriumban hozzászólnak, ez az érték nő 1-el minden poszt után, éjfélkor a dolgok újraértékelődnek, ez meg 0-ra visszavált 
# lastpostdate: utolsó poszt időpontja
# currlocalpid: jelenlegi (threden belül legutóbbi) thred-lokális poszt-id
# MOVED: opener_pid integer not null references post.pid: post táblában a pid-eknél ha a localpid = 0.

CREATE TABLE post_table(
    pid INTEGER NOT NULL,                                                                /* p_id */
    uid INTEGER NOT NULL REFERENCES user.uid                                             /* u_id */
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    tid INTEGER NOT NULL REFERENCES thread.tid                                           /* t_id */
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    bid INTEGER NOT NULL REFERENCES board.bid                                            /* b_id */
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    nid INTEGER NOT NULL REFERENCES anon2.nid                                            /* n_id */
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    localpid INTEGER,                                                                    /* p_id */
    dispName VARCHAR(32),                                                                /* name */
    postdate DATETIME NOT NULL,
    text VARCHAR(4096),
    bantext VARCHAR(1024) DEFAULT '<span style="color:#f00; font-weight:bold">BANNOLTUK</span>',
    isReported BOOL NOT NULL,
    PRIMARY KEY(pid,bid)
);

# pid: board-onkénti thred id
# uid: poszthoz hozzárendelt userid
# tid: poszt ebben a thredben van
# bid: poszt ezen a boardon van (lehet felesleges, mert a thread-ben is van bid)
# localpid: thred-lokális poszt-id
# dispName: ide kerül hogy mi került megjelenítésre a posztnál
# postdate: egyértelmű kapitány
# text: szövegtörzs bár lehet foglalt ez a kifejezés
# bantext: ha vizuális bant akarunk csinálni akkor annak az esetleg egyedi szövege ide kerül
# RENAMED: isDelNominated -> isReported
# isReported: ha reportolva van, akkor megjelenik a poszt a modfelületen a reportolt posztok alatt
# majd meg kell beszélnünk, hogy a POST fgv meghívásakor miket lehet a texten lefuttatni, illetve miket kell letárolni adattagonként a szkriptekből. -zorg

#CREATE TABLE image(
#     iid INTEGER NOT NULL PRIMARY KEY,                                                    /* i_id */
#     unixtimestamp INTEGER NOT NULL,
#     origfilename VARCHAR(255) NOT NULL,
#     ext VARCHAR(8) NOT NULL,
#     filesize INTEGER NOT NULL,
#     dim_x INTEGER NOT NULL,
#     dim_y INTEGER NOT NULL 
#) 

# régi implementáció, megőrizve mert megtehetem

CREATE TABLE file_table(
    iid INTEGER NOT NULL PRIMARY KEY,                                                    /* i_id */
    md5hash VARCHAR(32) NOT NULL UNIQUE,
    ext VARCHAR(8) NOT NULL REFERENCES filetype_table.ext
	    ON UPDATE CASCADE                     /*  */
        ON DELETE CASCADE,                    /* jólenne ha nem kerülne az összes fájltípus közül egy se törlésre, mert akkor a feltöltött dolgok vesznek a db-ből */
    filesize INTEGER NOT NULL,
    dim_x INTEGER,
    dim_y INTEGER,
    length_sec INTEGER   
);
    
# iid: fájl id (neve azért iid mert eredetileg image id volt)
# md5hash: egyértelmű
# ext: kiterjesztés
# filesize: tippelj
# dim_x: képnél jelent valamit is
# dim_y: -"-
# length_sec: képnél semmit se jelent
# unixtimestamp.ext formában elérhetőek a képek a boardonkénti virtuális mappákból

CREATE TABLE imgpostlink_table(
    gid INTEGER NOT NULL,
    iid INTEGER NOT NULL REFERENCES file_table.iid
         ON UPDATE CASCADE                     /*  */
         ON DELETE CASCADE,                    /*  */
    pid INTEGER NOT NULL REFERENCES post.pid
         ON UPDATE CASCADE                     /*  */
         ON DELETE CASCADE,                    /*  */
    bid INTEGER NOT NULL REFERENCES board.bid
         ON UPDATE CASCADE                     /*  */
         ON DELETE CASCADE,                    /* ezzel óvatosan */
    unixtimestamp INTEGER NOT NULL,
    origfilename VARCHAR(255) NOT NULL,
    isSpoiler BOOL NOT NULL,
    isNSFW BOOL NOT NULL,
    PRIMARY KEY(iid,gid,pid,bid)
);

# gid: in-gallery file id
# iid: feltöltött fájl id
# pid: poszt id
# bid: board id
# unixtimestamp: a megjelenítendő default neve a kép(ek)nek a posztnál
# origfilename: eredetileg ezen a néven töltötték fel
# isSpoiler: igaz -> szpojlerkép lesz a thumbnail
# isNSFW: igaz -> nsfw warning lesz a thumbnail (kobájnolódhat a spoilerrel, amúgy lehet erre nincs szükség egyátalán, sőt)
# átbasztam a fájlneveket ide, mert attól még hogy egy példányban van egy kép tárolva, még lehet más néven "feltöltve".

CREATE TABLE anon2_table(
    nid INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
);

# nid: id
# name: ípéc imre meg hasonlók

CREATE TABLE anon2boardlink_table(
    nid INTEGER NOT NULL REFERENCES anon2_table.nid
	    ON UPDATE CASCADE                     /*  */
		ON DELETE CASCADE,                    /*  */
	bid INTEGER NOT NULL REFERENCES board.bid
        ON UPDATE CASCADE                     /*  */
        ON DELETE CASCADE,                    /*  */
	allposts INTEGER,
    aliveposts INTEGER,
    uploaded INTEGER,
    embedded INTEGER,
    banned INTEGER,
	PRIMARY KEY(nid,bid)
);

# nid: ípéc imre id
# bid: ha 0 akkor globális ípéc imre, egyébként board specifikus
# allposts: bid,nid által meghatározott posztolások összes eddigi száma
# aliveposts: bid,nid által meghatározott posztolások jelenlegi száma
# uploaded: bid,nid által meghatározott feltöltések száma
# embedded: bid,nid által meghatározott embedek száma
# banned: bid,nid által meghatározott banok száma
# ha netán akarunk board specific ípéc imrákokat (igen) (amúgy nincs arcom hogy a leaderboard tábla belemergelhető volt ebbe)

CREATE TABLE announcement_table(
     aid INTEGER NOT NULL PRIMARY KEY,
     text VARCHAR(1024)
);

# text: announcement szövege.

CREATE TABLE announcehandler_table(
     aid INTEGER NOT NULL REFERENCES announcement.aid
          ON UPDATE CASCADE                     /*  */
          ON DELETE CASCADE,                    /*  */
     bid INTEGER NOT NULL REFERENCES board.bid
          ON UPDATE CASCADE                     /*  */
          ON DELETE CASCADE,                    /*  */
     PRIMARY KEY(aid,bid)
);

# boardot és announcementeket összekötő tábla, ha bid 0 akkor globális announcement.

CREATE TABLE filters_table(
     filterid INTEGER NOT NULL PRIMARY KEY,
     reg_exp VARCHAR(1024) NOT NULL,
     output VARCHAR(1024),
     isUsed BOOL NOT NULL
);

# regexp: kifejezés
# output: regexpre mit adjon vissza
# isUsed: be van e kapcsolva
# ezt itt tároljuk vagy inkább cfg/php-ben?

#--------------------------------------------------------ITT TART A RESTRUKTURÁLÁS----------------------------------------------------#
#todo: ellenőrizni hogy külső kulcsoknál a hivattkozott board neve meg a mezője jó e (protip: nem mind jó)

CREATE TABLE ban(
     id INTEGER NOT NULL PRIMARY KEY,
     uid INTEGER NOT NULL REFERENCES user.uid                                             /* u_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE,
     bid INTEGER NOT NULL REFERENCES board.bid                                            /* b_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE,
     submitter INTEGER NOT NULL REFERENCES user.uid                                       /* u_id */
          ON UPDATE CASCADE
          ON DELETE SET NULL,
     submitted DATETIME NOT NULL,
     expires DATETIME
);

#TODO: board specifikus ban lehetőség -> userrel egybeköttöt tábla <- done

CREATE TABLE modwatcher(
     uid INTEGER NOT NULL REFERENCES user.uid                                             /* u_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE,
     deed VARCHAR(767) NOT NULL,
     accomplished DATETIME NOT NULL,
     PRIMARY KEY(uid,accomplished,deed)
);

#TODO: modályok ténykedéseit követő tábla -> userrel egybekötött tábla <- done

