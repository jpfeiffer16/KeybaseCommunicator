//#include <stdio.h>
//
//int main (int argc, char *argv[])
//{
//	printf ("Hello world!\n");
//	
//	return 0;
//}

//#include <iostream>
//
//int main()
//{
//	std::cout << "Hello World!\n";
//}


//TODO: Use these to provide printf instead of using std::
//#include <stdio.h>
//#include <stdlib.h>
//
//#include <iostream>
//#include <gtk/gtk.h>
//
//static void destroy_window( GtkWidget *widget,
//                            gpointer  pointer )
//{
//  gtk_main_quit ();
//
//  std::cout << "Window being destroyed\n";
//}
//
//int main(int argc, char *argv[])
//{
//  GtkWidget *window;
//  gtk_init (&argc, &argv);
//  window = gtk_window_new (GTK_WINDOW_TOPLEVEL);
//  //gtk_widget_set_size_request (GTK_WIDGET (window), 200, 100);
//  gtk_window_set_default_size (GTK_WINDOW (window), 400, 400);
//  g_signal_connect (G_OBJECT (window), "destroy",G_CALLBACK (destroy_window), NULL);
//  gtk_container_add (GTK_CONTAINER (window), gtk_label_new ("Hello, World"));
//  gtk_widget_show_all (window);
//  gtk_main ();
//  return 0;
//}


// #include <iostream>
#include <ncurses.h>

//int main()
//{
//  // std::cout << "Hello World!\n";
//  initscr();
//  raw();
//  noecho();
//}

 void DrawBorder();

 int main()
 {
  initscr();
  cbreak();
  noecho();
  nodelay(stdscr,TRUE);
  keypad(stdscr,TRUE);

  start_color();
  init_pair(1,COLOR_BLACK,COLOR_BLUE);
  init_pair(2,COLOR_BLACK,COLOR_RED);
  init_pair(3,COLOR_RED,COLOR_WHITE);

  DrawBorder();

  WINDOW* ROOM;
  WINDOW* PEERS;
  WINDOW* INPUT;

  // newwin(rows,cols,y_org,x_org)
  ROOM = newwin(18,59,1,1);
  box(ROOM,'*','*');
  wbkgd(ROOM,COLOR_PAIR(1));
  mvwaddstr(ROOM, 1,1, "Chat box\n");

  PEERS = newwin(18,18,1,60);
  box(PEERS,'*','*');
  wbkgd(PEERS,COLOR_PAIR(2));
  mvwaddstr(PEERS, 1,1, "Peer list:\n");

  INPUT = newwin(4,77,19,1);
  box(INPUT,'*','*');
  wbkgd(INPUT,COLOR_PAIR(3));
  mvwprintw(INPUT,1,1, "Message: ");

  int c;
  c = getch();
  char* input;
  do
  {
    /*touchwin(ROOM);
    touchwin(PEERS);
    */
    wrefresh(PEERS);
    wrefresh(ROOM);   
    wrefresh(INPUT);

    echo();
    //wscanw(INPUT,"%s",input); // Can't get window input to work ATM
    noecho();

    touchwin(INPUT);
    
    c = getch();
    
  }
  while(c != KEY_F(1));

  nodelay(stdscr,FALSE);
  getch();
  delwin(ROOM);
  delwin(PEERS);
  delwin(INPUT);
  endwin();

  return 0;
 }

 void DrawBorder()
 {
  clear();
  box(stdscr,'*','*');
 }


