from django.shortcuts import render
from datetime import datetime
import calendar


# Create your views here.
def view_profile(request):
    return render(request, "account/profile.html")


def view_panel(request):
    if request.method == 'POST':
        selected_year = int(request.POST['year'])
        selected_month = int(request.POST['month'])
    else:
        selected_year = datetime.now().year
        selected_month = datetime.now().month
    current_day_num = datetime.now().day
    weekday_of_start = datetime(selected_year, selected_month, 1).weekday()
    last_day = calendar.monthrange(selected_year, selected_month)[1]
    months = {i: month_name for i, month_name in enumerate(calendar.month_name) if i != 0}
    prev_month = selected_month - 1 if selected_month - 1 > 0 else 12
    last_day_prev_month = calendar.monthrange(selected_year, prev_month)[1]
    prev_days = range(last_day_prev_month - weekday_of_start + 1, last_day_prev_month + 1)
    next_days = range(1, 42 - last_day - weekday_of_start + 1)
    return render(request, "account/dietitian_panel.html",
                  {"current_date": datetime.now(),
                   "current_day_num": current_day_num,
                   "selected_year": selected_year,
                   "selected_month": selected_month,
                   "years": range(2023, 2028),
                   "months": months,
                   "weekdays": calendar.day_name,
                   "prev_days": prev_days,
                   "days": range(1, last_day + 1),
                   "next_days": next_days})


def view_landing_page(request):
    return render(request, "account/landing_page.html")
