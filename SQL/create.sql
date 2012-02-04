CREATE DATABASE lohereplus;
USE lohereplus;
#kommentek a táblakreálások alatt fognak szerepelni, és a komment feletti táblára vonatkoznak -zorg
# /* */ közt lehet (nem ;-al lezárt) sorok mögé is, de ott inkább az egyező típusokat jelölöm, konzisztencia miatt.

CREATE TABLE user(
     uid INTEGER NOT NULL PRIMARY KEY,                                                    /* u_id */
     username VARCHAR(32) NOT NULL,                                                       /* name */
     password VARCHAR(32) NOT NULL,                                                       /* pass */
     userlevel INTEGER NOT NULL,
     regdate DATETIME NOT NULL,
     lastdate DATETIME NOT NULL,
     regIPh VARCHAR(40) NOT NULL,                                                           /* IP_h */
     dispNameType SMALLINT NOT NULL,
     isLazyload BOOL NOT NULL,
     isHTMLview BOOL NOT NULL,
     cssSkin VARCHAR(32) NOT NULL DEFAULT 'lohere'                                        /* sCSS */
);
     
# regIPh az a regisztrációnál használt ip hash-e, ha a hash kötött karakterhosszúságú, akkor legyen CHAR(n).
# isAnon és isAnon2 nem lehet egyszerre 1, de 0 igen; erről gondoskodni kell majd a "profil lap" funkcionalitásában.
# isBanned bool eltüntetve mert nem támogat per-board ban-t.
# isanon, isanon2 mergelve dispNameType-ba

CREATE TABLE iphash(
     IPh VARCHAR(40) NOT NULL,                                                              /* IP_h */
     seendate DATETIME NOT NULL,
     uid INTEGER NOT NULL REFERENCES user.uid                                             /* u_id */
          ON UPDATE CASCADE                     /* nem fordulhat elő */
          ON DELETE CASCADE,                    /* user törlése -> iphashek törlése */
     PRIMARY KEY(IPh,uid)
);

# érveljetek gecyk

CREATE TABLE board(
     bid INTEGER NOT NULL PRIMARY KEY,                                                    /* b_id */
     name VARCHAR(16) NOT NULL UNIQUE,          /* /b/, /kocka/,... */
     descr VARCHAR(64),                          /* SZOPKIGECIM HEEE */
     cssSkin VARCHAR(32) NOT NULL DEFAULT 'lohere',                                       /* sCSS */
     cssOverride BOOL NOT NULL,
     isHidden BOOL NOT NULL,                    /* nem tölti be a boardot */
     isLocked BOOL NOT NULL,                    /* betölti a boardot, de midnen lockolva */
     isSecured BOOL NOT NULL,                   /* /_/ nem látszik, belső linkek belső-404-elnek */
     isRedirected BOOL NULL,                    /*  */
     isNSFW BOOL NOT NULL DEFAULT TRUE,
     maxthreadnumber INTEGER NOT NULL,
     threadsperpage INTEGER NOT NULL,
     postdelaysecs INTEGER,
     currlocalpid INTEGER NOT NULL,
     currlocaltid INTEGER NOT NULL,
     primary_board_if_alias INTEGER                                                       /* b_id */
);

# addoltam a nyilvántartó dolgokat, amik poszt/thredtörlés hatására is maradnak a seggükön

CREATE TABLE ftypeboardlink(
     bid INTEGER NOT NULL REFERENCES board.bid                                            /* b_id */
          ON UPDATE CASCADE                     /* nem fordulhat elő */
          ON DELETE CASCADE,                    /* board törölve */
     fid INTEGER NOT NULL REFERENCES filetype.fid                                         /* f_id */
          ON UPDATE CASCADE                     /* nem fordulhat elő */
          ON DELETE CASCADE,                    /* fájltípus törölve */
     maxfilesize INTEGER DEFAULT 5242880,
     PRIMARY KEY(bid,fid)
);

# érveljetek gecyk

CREATE TABLE filetype(
     fid INTEGER NOT NULL PRIMARY KEY,                                                    /* f_id */
     ext VARCHAR(8) NOT NULL,
     mime VARCHAR(48),
     magic BLOB, /* nincs clob mysqlben :C */
     icon VARCHAR(32)
);

# iconhoz nem teszünk not null feltételt.

CREATE TABLE thread(
     tid INTEGER NOT NULL PRIMARY KEY,                                                    /* t_id */
     isDeleted BOOL NOT NULL,
     isLocked BOOL NOT NULL,
     isSticky BOOL NOT NULL,
     isDroppedoff BOOL NOT NULL,
     purgbumpsreceived INTEGER,
     lastpostdate DATETIME NOT NULL,
     currlocalpid INTEGER DEFAULT 0,
     bid INTEGER NOT NULL REFERENCES board.bid                                            /* b_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE
);

# érveljetek gecyk

CREATE TABLE post(
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
     isDelnominated BOOL NOT NULL,
     PRIMARY KEY(pid,bid)
);

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

CREATE TABLE image(
    iid INTEGER NOT NULL PRIMARY KEY,                                                    /* i_id */
    md5hash VARCHAR(32) NOT NULL UNIQUE,
    ext VARCHAR(8) NOT NULL,
    filesize INTEGER NOT NULL,
    dim_x INTEGER,
    dim_y INTEGER,
    length_sec INTEGER   
);
    
# unixtimestamp.ext formában elérhetőek a képek a boardonkénti virtuális mappákból

CREATE TABLE imgpostlink(
    gid INTEGER NOT NULL,                      /* in-gallery image id */                 /* g_id */
    iid INTEGER NOT NULL REFERENCES image.iid                                            /* i_id */
         ON UPDATE CASCADE
         ON DELETE CASCADE,
    pid INTEGER NOT NULL REFERENCES post.pid                                             /* p_id */
         ON UPDATE CASCADE
         ON DELETE CASCADE,
    bid INTEGER NOT NULL REFERENCES board.bid                                            /* b_id */
         ON UPDATE CASCADE
         ON DELETE CASCADE,                    /* ezzel óvatosan */
    unixtimestamp INTEGER NOT NULL,
    origfilename VARCHAR(255) NOT NULL,
    isSpoiler BOOL NOT NULL,
    isNSFW BOOL NOT NULL,
    PRIMARY KEY(iid,gid,pid,bid)
);

# átbasztam a fájlneveket ide, mert attól még hogy egy példányban van egy kép tárolva, még lehet más néven "feltöltve".

CREATE TABLE anon2(
     nid INTEGER NOT NULL PRIMARY KEY,
     name VARCHAR(32) NOT NULL
);

# érveljetek gecyk

CREATE TABLE leaderboard(
     nid INTEGER NOT NULL REFERENCES anon2.bid                                            /* n_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE,
     bid INTEGER REFERENCES board.bid                                                     /* b_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE,
     allposts INTEGER,
     aliveposts INTEGER,
     uploaded INTEGER,
     embedded INTEGER,
     banned INTEGER,
     PRIMARY KEY(nid,bid)
);

# érveljetek gecyk

CREATE TABLE announcement(
     aid INTEGER NOT NULL PRIMARY KEY,                                                    /* a_id */
     text VARCHAR(1024)
);

# érveljetek gecyk

CREATE TABLE announcehandler(
     aid INTEGER NOT NULL REFERENCES announcement.aid                                     /* a_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE,
     bid INTEGER NOT NULL REFERENCES board.bid                                            /* b_id */
          ON UPDATE CASCADE
          ON DELETE CASCADE,
     PRIMARY KEY(aid,bid)
);

# érveljetek gecyk

CREATE TABLE filters(
     filterid INTEGER NOT NULL PRIMARY KEY,
     reg_exp VARCHAR(1024) NOT NULL,
     output VARCHAR(1024),
     isUsed BOOL NOT NULL
);

# érveljetek gecyk

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

