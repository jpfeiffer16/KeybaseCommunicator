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
#include <stdio.h>
#include <stdlib.h>

#include <iostream>
#include <gtk/gtk.h>

static void destroy_window( GtkWidget *widget,
                            gpointer  pointer )
{
  gtk_main_quit ();

  std::cout << "Window being destroyed\n";
}

int main(int argc, char *argv[])
{
  GtkWidget *window;
  gtk_init (&argc, &argv);
  window = gtk_window_new (GTK_WINDOW_TOPLEVEL);
  //gtk_widget_set_size_request (GTK_WIDGET (window), 200, 100);
  gtk_window_set_default_size (GTK_WINDOW (window), 400, 400);
  g_signal_connect (G_OBJECT (window), "destroy",G_CALLBACK (destroy_window), NULL);
  gtk_container_add (GTK_CONTAINER (window), gtk_label_new ("Hello, World"));
  gtk_widget_show_all (window);
  gtk_main ();
  return 0;
}